import * as Yup from 'yup';
import PropTypes, { element } from 'prop-types';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
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

// ----------------------------------------------------------------------

MatchLineUpForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMatch: PropTypes.object,
  onCancel: PropTypes.func
};

export default function MatchLineUpForm({ onCancel, clubId, addMember, changeSelected, currentLineUp, isReverse, isHome }) {
  const dispatch = useDispatch();
  const { currentMatch, lineup } = useSelector((state) => state.match);
  const { HomeLineUp, HomeReverse, AwayLineUp, AwayReverse } = lineup
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { clubContractList } = useSelector(state => state.player)
  const [selectedPlayer, setSelectedPlayer] = useState([])
  const [selected, setSelected] = useState([])
  const NewMatchSchema = Yup.object().shape({
    GoalKeeper: Yup.mixed().required('Goal Keeper is required'),
  });
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }
  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    if (clubContractList.length !== 0) {
      setOptions([...clubContractList]);
    }
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  const isEdit = !_.isEmpty(currentMatch)
  useEffect(() => {
    if (isEdit) {
      dispatch(getClubMatchContract(clubId))
    }

  }, [dispatch])
  useEffect(() => {
    if (isHome) {
      const HomeReverseSelected = !_.isEmpty(HomeReverse) ? [HomeReverse.GoalKeeper, ...HomeReverse.Defender, ...HomeReverse.Midfielder, ...HomeReverse.Forward] : []
      const HomeLineUpSelected = !_.isEmpty(HomeLineUp) ? [HomeLineUp.GoalKeeper, ...HomeLineUp.Defender, ...HomeLineUp.Midfielder, ...HomeLineUp.Forward] : []
      setSelected([...HomeReverseSelected, ...HomeLineUpSelected])
    } else {
      const AwayReverseSelected = !_.isEmpty(AwayReverse) ? [AwayReverse.GoalKeeper, ...AwayReverse.Defender, ...AwayReverse.Midfielder, ...AwayReverse.Forward] : []
      const AwayLineUpSelected = !_.isEmpty(AwayLineUp) ? [AwayLineUp.GoalKeeper, ...AwayLineUp.Defender, ...AwayLineUp.Midfielder, ...AwayLineUp.Forward] : []
      setSelected([...AwayReverseSelected, ...AwayLineUpSelected])
    }
  }, [lineup])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      GoalKeeper: currentLineUp?.GoalKeeper || null,
      Defender: currentLineUp?.Defender || [],
      Midfielder: currentLineUp?.Midfielder || [],
      Forward: currentLineUp?.Forward || [],

    },
    validationSchema: NewMatchSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        console.log(isReverse, isHome, selectedPlayer, '1');
        if (!isReverse) {
          if (selectedPlayer.length === 11) {
            onCancel()
            addMember(values)
            changeSelected(selectedPlayer)
          } else {
            setErrorState({ isError: true, Message: "Lineup must have 11 player" })
          }
        } else {
          if (selectedPlayer.length >= 9) {
            onCancel()
            addMember(values)
            changeSelected(selectedPlayer)
          }
          else {
            setErrorState({ isError: true, Message: "Reverse must have at least 9 player" })
          }
        }


      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });
  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      console.log('check state', errorState);

      if (!errorState.isError) {
        formik.resetForm();
        onCancel();
        enqueueSnackbar(currentMatch ? 'Create success' : 'Update success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.match.list);
      } else {
        console.log('bị error');
      }
    }

  }, [errorState])
  const disableOption = (option, field) => {
    return (!!selectedPlayer?.find(element => element?.id === option?.id) || selectedPlayer.length >= 11 || !!selected?.find(element => element?.id === option?.id)) && (Array.isArray(field) ? !field.find(element => element?.id === option?.id) : field?.id !== option?.id)
  }
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  useEffect(() => {
    if (_.isEmpty(values.GoalKeeper)) {
      setSelectedPlayer([...values.Defender, ...values.Forward, ...values.Midfielder])
    } else {
      setSelectedPlayer([{ ...values.GoalKeeper }, ...values.Defender, ...values.Forward, ...values.Midfielder])
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
                value={values.GoalKeeper}
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
                getOptionDisabled={option => disableOption(option, values.GoalKeeper)}
                getOptionLabel={(option) => option?.player?.name}
                onChange={(event, value) => setFieldValue('GoalKeeper', value)}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.player.name} src={option?.player.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option.player.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    helperText={touched.GoalKeeper && errors.GoalKeeper}
                    error={Boolean(touched.GoalKeeper && errors.GoalKeeper)}
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
                value={values.Defender}
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
                getOptionDisabled={option => disableOption(option, values.Defender)}
                onChange={(event, value) => setFieldValue('Defender', value)}
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
                value={values.Midfielder}
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
                options={clubContractList}
                getOptionDisabled={option => disableOption(option, values.Midfielder)}

                getOptionLabel={(option) => option.player.name}
                onChange={(event, value) => { setFieldValue('Midfielder', value) }}
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
                value={values.Forward}
                multiple
                limitTags={2}
                autoHighlight
                options={clubContractList}
                getOptionLabel={(option) => option?.player.name}
                getOptionDisabled={option => disableOption(option, values.Forward)}
                onChange={(event, value) => { setFieldValue('Forward', value) }}
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
        {errorState?.isError ? <Alert sx={{ mx: 3 }} severity="warning">{errorState.Message}</Alert> : ''}

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
