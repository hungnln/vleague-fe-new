import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { DatePicker, LoadingButton, MobileDateTimePicker } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Button, DialogActions, Autocomplete, Avatar } from '@mui/material';
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
import _ from 'lodash';
import { getClubList } from 'src/redux/slices/club';
import { getStadiumList } from 'src/redux/slices/stadium';
import { useSelector } from 'react-redux';
import { getMatchPlayerContract } from 'src/redux/slices/player';
import { SUCCESS } from 'src/config';

// ----------------------------------------------------------------------

MatchNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMatch: PropTypes.object,
  onCancel: PropTypes.func
};

export default function MatchNewForm({ tournamentID, currentMatch, onCancel, roundSelected }) {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { clubList } = useSelector((state) => state.club);
  const { tournamentDetail } = useSelector(state => state.tournament)
  const { stadiumList } = useSelector((state) => state.stadium);
  const { roundList } = useSelector((state) => state.round);
  const { homeContractList, awayContractList } = useSelector(state => state.player)
  const { selectedHomePlayer, setSelectedHomePlayer } = useState([])
  const [selectedClub, setSelectedClub] = useState([])
  const disableOption = (option, field) => {
    return (!!selectedClub?.find(club => club?.id === option?.id)) && (!_.isEmpty(field) ? (field?.id !== option?.id) : true)
  }
  const NewMatchSchema = Yup.object().shape({
    startDate: Yup.string().required('StartDate is required'),
    homeClub: Yup.mixed().required('HomeClub is required'),
    awayClub: Yup.mixed().required('AwayClub is required'),
    stadium: Yup.mixed().required('Stadium is required'),
    round: Yup.mixed().required('Round is required'),

  });
  const EditMatchSchema = Yup.object().shape({

  });
  const isEdit = !_.isEmpty(currentMatch)
  useEffect(() => {
    dispatch(getClubList(0, 1000))
    dispatch(getStadiumList(0, 1000))
    if (isEdit) {
      dispatch(getMatchPlayerContract(currentMatch?.homeClub.id, currentMatch?.awayClub.id))
    }
  }, [dispatch])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: (isEdit ?
      {
        id: currentMatch?.id,
        stadium: currentMatch?.stadium,
        homeClub: currentMatch?.homeClub,
        awayClub: currentMatch?.awayClub,
        homePlayer: [],
        awayPlayer: [],
        staffPlayer: []
      } :
      {
        id: currentMatch?.id || '',
        startDate: currentMatch?.startDate || '',
        homeClub: currentMatch?.homeClub || null,
        awayClub: currentMatch?.awayClub || null,
        stadium: currentMatch?.stadium || null,
        round: currentMatch?.round || roundSelected,
      }),
    validationSchema: (isEdit ? EditMatchSchema : NewMatchSchema),
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (!isEdit) {
          const data = {
            startDate: values.startDate,
            homeClubId: values.homeClub.id,
            awayClubId: values.awayClub.id,
            stadiumId: values.stadium.id,
            roundId: values.round.id
          }
          dispatch(createMatch(data, (value) => setErrorState(value)))
        }
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });
  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      if (errorState.status === SUCCESS) {
        formik.resetForm();
        enqueueSnackbar(errorState.message, { variant: 'success' });
        onCancel()
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
      }
    }
  }, [errorState])
  const disableStartDate = (date) => {
    return new Date(date) > new Date(tournamentDetail.to) || new Date(date) < new Date(tournamentDetail.from)
  }
  // useEffect(() => {
  //   console.log('listPlayer', formik.values.HomePlayer);

  // }, [formik.values.HomePlayer])
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  useEffect(() => {
    setSelectedClub([{ ...values.homeClub }, { ...values.awayClub }])
  }, [values])
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        {!isEdit && (
          <Stack spacing={3} sx={{ p: 3 }}>
            <Autocomplete
              fullWidth
              options={roundList.data}
              autoHighlight
              {...isEdit ? { value: formik.values.round, disabled: 'true' } : {}}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setFieldValue('round', newValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  {/* <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} /> */}
                  {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  helperText={touched.round && errors.round}
                  error={Boolean(touched.round && errors.round)}
                  {...params}
                  label="Round"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <Autocomplete
              getOptionDisabled={option => disableOption(option, values.homeClub)}
              fullWidth
              options={clubList.data}
              autoHighlight
              value={values.homeClub}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setFieldValue('homeClub', newValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                  {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  helperText={touched.homeClub && errors.homeClub}
                  error={Boolean(touched.homeClub && errors.homeClub)}
                  {...params}
                  label="HomeClub"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <Autocomplete
              getOptionDisabled={option => disableOption(option, values.awayClub)}
              fullWidth
              options={clubList.data}
              autoHighlight
              value={values.awayClub}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setFieldValue('awayClub', newValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                  {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  helperText={touched.awayClub && errors.awayClub}
                  error={Boolean(touched.awayClub && errors.awayClub)}
                  {...params}
                  label="AwayClub"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <Autocomplete
              fullWidth
              options={stadiumList.data}
              autoHighlight
              {...isEdit ? { value: formik.values.stadium, disabled: 'true' } : {}}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setFieldValue('stadium', newValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                  {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  helperText={touched.stadium && errors.stadium}
                  error={Boolean(touched.stadium && errors.stadium)}
                  {...params}
                  label="Stadium"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <MobileDateTimePicker
              shouldDisableDate={(date) => disableStartDate(date)}
              label="Start date"
              value={values.startDate}
              inputFormat="dd/MM/yyyy hh:mm a"
              onChange={(startDate) => setFieldValue('startDate', startDate)}
              renderInput={(params) => <TextField {...params} fullWidth
                helperText={touched.startDate && errors.startDate}
                error={Boolean(touched.startDate && errors.startDate)} />}
            />
          </Stack>
        )}
        {isEdit && (
          <Grid container spacing={2} sx={{ p: 3 }}>
            <Grid item xs={4}>
              <Stack direction='column' spacing={{ xs: 3, sm: 2 }}>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ px: 3 }}
                  >
                    {values.homeClub.name}
                  </Typography>
                  <Typography
                    sx={{ px: 3, color: 'text.secondary' }}
                    variant="body2"
                  >
                    Home
                  </Typography>
                </Box>
                <Autocomplete
                  autoHighlight
                  options={homeContractList}
                  getOptionLabel={(option) => option.player.name}
                  onChange={(event, value) => { setFieldValue('Club', value) }}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <Avatar alt={option?.player.name} src={option?.player.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                      {option.player.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Goal Keeper"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }} />
                  )}
                />
                <Autocomplete
                  multiple
                  limitTags={2}
                  autoHighlight
                  options={homeContractList}
                  getOptionLabel={(option) => option.player.name}
                  onChange={(event, value) => { setFieldValue('HomePlayer', value) }}
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
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }} />
                  )}
                />


              </Stack>
            </Grid>
            <Grid item xs={4}>
              1
            </Grid>
            <Grid item xs={4}>
              1
            </Grid>
          </Grid>
        )}
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
