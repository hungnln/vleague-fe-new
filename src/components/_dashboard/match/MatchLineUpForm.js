import * as Yup from 'yup';
import PropTypes, { element } from 'prop-types';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { DatePicker, LoadingButton, MobileDateTimePicker } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Button, DialogActions, Autocomplete, Avatar, CircularProgress, Alert } from '@mui/material';
// utils
import { getBase64FromUrl, getBase64Image, toBase64 } from 'src/utils/base64/base64';
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadAvatar } from '../../upload';
import countries from './countries';
import { createMatch, editMatch } from 'src/redux/slices/match';
import { useDispatch } from 'src/redux/store';
import _, { isError } from 'lodash';
import { getClubList } from 'src/redux/slices/club';
import { getStadiumList } from 'src/redux/slices/stadium';
import { useSelector } from 'react-redux';
import { getClubMatchContract, getMatchPlayerContract } from 'src/redux/slices/player';
import { FAILURE, SUCCESS } from 'src/config';

// ----------------------------------------------------------------------

MatchLineUpForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMatch: PropTypes.object,
  onCancel: PropTypes.func
};

export default function MatchLineUpForm({ onCancel, startDate, clubId, addMember, changeSelected, currentLineUp, isReverse, isHome }) {
  const dispatch = useDispatch();
  const { currentMatch, matchParticipation } = useSelector((state) => state.match);
  const { homeLineUp, homeReverse, awayLineUp, awayReverse } = matchParticipation
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { clubContractList } = useSelector(state => state.player)
  const [selectedPlayer, setSelectedPlayer] = useState([])
  const [selected, setSelected] = useState([])
  const lineupSchema = Yup.object().shape({
    goalKeeper: Yup.mixed().required('Goal Keeper is required'),
  });
  const reverseChema = Yup.object().shape({
    // goalKeeper: Yup.mixed().required('Goal Keeper is required'),
  });
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0
  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }
  useEffect(() => {
    // console.log("check loading");
    const active = true
    if (!loading) {
      return undefined;
    }
    (async () => {
      if (clubContractList.data.length <= 0) {
        await sleep(1e3);
      }
      // For demo purposes.

      if (active && clubContractList.data.length > 0) {
        setOptions([...clubContractList.data]);
      }
    })();
    // if (active && clubContractList.length !== 0) {
    //   setLoading(false)
    //   setOptions([...clubContractList]);
    // }
  }, [loading]);
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  const isEdit = !_.isEmpty(currentMatch)
  useEffect(() => {
    if (isEdit) {
      dispatch(getClubMatchContract(clubId, startDate, 0, 1000))
    }

  }, [dispatch])
  console.log(startDate, 'check');
  useEffect(() => {
    if (isHome) {
      const homeReverseSelected = !_.isEmpty(homeReverse) ? [homeReverse.goalKeeper, ...homeReverse.defender, ...homeReverse.midfielder, ...homeReverse.forward] : []
      const homeLineUpSelected = !_.isEmpty(homeLineUp) ? [homeLineUp.goalKeeper, ...homeLineUp.defender, ...homeLineUp.midfielder, ...homeLineUp.forward] : []
      setSelected([...homeReverseSelected, ...homeLineUpSelected])
    } else {
      const awayReverseSelected = !_.isEmpty(awayReverse) ? [awayReverse.goalKeeper, ...awayReverse.defender, ...awayReverse.midfielder, ...awayReverse.forward] : []
      const awayLineUpSelected = !_.isEmpty(awayLineUp) ? [awayLineUp.goalKeeper, ...awayLineUp.defender, ...awayLineUp.midfielder, ...awayLineUp.forward] : []
      setSelected([...awayReverseSelected, ...awayLineUpSelected])
    }
  }, [])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      goalKeeper: currentLineUp?.goalKeeper || null,
      defender: currentLineUp?.defender || [],
      midfielder: currentLineUp?.midfielder || [],
      forward: currentLineUp?.forward || [],

    },
    validationSchema: isReverse ? reverseChema : lineupSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        console.log(isReverse, isHome, selectedPlayer, '1');
        if (!isReverse) {
          if (selectedPlayer.length === 11) {
            onCancel()
            addMember(values)
            changeSelected(selectedPlayer)
          } else {
            setErrorState({ status: FAILURE, message: "Lineup must have 11 players" })
          }
        } else {
          if (selectedPlayer.length >= 4 && selectedPlayer.length <= 19) {
            onCancel()
            addMember(values)
            changeSelected(selectedPlayer)
          }
          else {
            setErrorState({ isError: FAILURE, message: "Reverse must have 9-19 players" })
          }
        }


      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });
  useEffect(() => { console.log(selected, 'selected'); }, [selected])
  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      if (errorState.status === SUCCESS) {
        formik.resetForm();
        onCancel();
        enqueueSnackbar(errorState.message, { variant: 'success' });
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
      }
    }

  }, [errorState])
  const disableOption = (option, field) => {
    return (!!selectedPlayer?.find(element => element?.id === option?.id) || (!isReverse ? selectedPlayer.length >= 11 : selectedPlayer.length >= 19) || !!selected?.find(element => element?.id === option?.id)) && (Array.isArray(field) ? !field.find(element => element?.id === option?.id) : field?.id !== option?.id)
  }
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  useEffect(() => {
    if (_.isEmpty(values.goalKeeper)) {
      setSelectedPlayer([...values.defender, ...values.forward, ...values.midfielder])
    } else {
      setSelectedPlayer([{ ...values.goalKeeper }, ...values.defender, ...values.forward, ...values.midfielder])
    }
  }, [values])
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12}>
            <Stack direction='column' spacing={{ xs: 3, sm: 2 }}>
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={values.goalKeeper}
                // open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                loading={loading}
                autoHighlight
                options={options}
                getOptionDisabled={option => disableOption(option, values.goalKeeper)}
                getOptionLabel={(option) => option?.player?.name}
                onChange={(event, value) => setFieldValue('goalKeeper', value)}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.player.name} src={option?.player.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option.player.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    helperText={touched.goalKeeper && errors.goalKeeper}
                    error={Boolean(touched.goalKeeper && errors.goalKeeper)}
                    {...params}
                    label="Goal Keeper"
                    InputProps={{
                      ...params.InputProps,

                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />
                )}
              />
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={values.defender}
                // open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                loading={loading}
                multiple
                limitTags={2}
                autoHighlight
                options={options}
                getOptionLabel={(option) => option.player.name}
                getOptionDisabled={option => disableOption(option, values.defender)}
                onChange={(event, value) => setFieldValue('defender', value)}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.player.name} src={option?.player.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option.player.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Defender"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />
                )}
              />
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={values.midfielder}
                get
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                loading={loading}
                multiple
                limitTags={2}
                autoHighlight
                options={options}
                getOptionDisabled={option => disableOption(option, values.midfielder)}

                getOptionLabel={(option) => option.player.name}
                onChange={(event, value) => { setFieldValue('midfielder', value) }}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.player.name} src={option?.player.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option.player.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Midfielder"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />
                )}
              />
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={values.forward}
                get
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                loading={loading}
                multiple
                limitTags={2}
                autoHighlight
                options={options}
                getOptionDisabled={option => disableOption(option, values.forward)}

                getOptionLabel={(option) => option.player.name}
                onChange={(event, value) => { setFieldValue('forward', value) }}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.player.name} src={option?.player.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option.player.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Forward"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />
                )}
              />


            </Stack>

          </Grid>

        </Grid>
        {errorState?.status === FAILURE ? <Alert severity="warning" sx={{ mx: 3 }}>{errorState?.message}</Alert> : ''}

        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
            {!isEdit ? 'Create Match' : 'Save Changes'}
          </LoadingButton>

        </DialogActions>
      </Form>
    </FormikProvider >
  );
}
