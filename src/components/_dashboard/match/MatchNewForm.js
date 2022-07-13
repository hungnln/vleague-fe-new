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
  const { stadiumList } = useSelector((state) => state.stadium);
  const { roundList } = useSelector((state) => state.round);
  const { homeContractList, awayContractList } = useSelector(state => state.player)
  const { selectedHomePlayer, setSelectedHomePlayer } = useState([])
  const [selectedClub, setSelectedClub] = useState([])
  const disableOption = (option, field) => {
    console.log(option, field, selectedClub, "check valid");
    return (!!selectedClub?.find(club => club?.id === option?.id)) && (!_.isEmpty(field) ? (field?.id !== option?.id) : true)
  }
  const NewMatchSchema = Yup.object().shape({
    StartDate: Yup.string().required('StartDate is required'),
    HomeClub: Yup.mixed().required('HomeClub is required'),
    AwayClub: Yup.mixed().required('AwayClub is required'),
    Stadium: Yup.mixed().required('Stadium is required'),
    Round: Yup.mixed().required('Round is required'),

  });
  const EditMatchSchema = Yup.object().shape({

  });
  const isEdit = !_.isEmpty(currentMatch)
  useEffect(() => {
    dispatch(getClubList())
    dispatch(getStadiumList())
    if (isEdit) {
      dispatch(getMatchPlayerContract(currentMatch?.homeClub.id, currentMatch?.awayClub.id))
    }
  }, [dispatch])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: (isEdit ?
      {
        id: currentMatch?.id,
        Stadium: currentMatch?.stadium,
        HomeClub: currentMatch?.homeClub,
        AwayClub: currentMatch?.awayClub,
        HomePlayer: [],
        AwayPlayer: [],
        StaffPlayer: []
      } :
      {
        id: currentMatch?.id || '',
        StartDate: currentMatch?.startDate || '',
        HomeClub: currentMatch?.homeClub || null,
        AwayClub: currentMatch?.awayClub || null,
        Stadium: currentMatch?.stadium || null,
        Round: currentMatch?.round || roundSelected,
      }),
    validationSchema: (isEdit ? EditMatchSchema : NewMatchSchema),
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (!isEdit) {
          const data = {
            StartDate: values.StartDate,
            HomeClubID: values.HomeClub.id,
            AwayClubID: values.AwayClub.id,
            StadiumID: values.Stadium.id,
            RoundID: values.Round.id
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
      if (!errorState.isError) {
        formik.resetForm();
        onCancel();
        enqueueSnackbar(currentMatch ? 'Create success' : 'Update success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.match.list);
      }
    }

  }, [errorState])

  // useEffect(() => {
  //   console.log('listPlayer', formik.values.HomePlayer);

  // }, [formik.values.HomePlayer])
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  useEffect(() => {
    setSelectedClub([{ ...values.HomeClub }, { ...values.AwayClub }])
  }, [values])
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        {!isEdit && (
          <Stack spacing={3} sx={{ p: 3 }}>
            <Autocomplete
              fullWidth
              options={roundList}
              autoHighlight
              {...isEdit ? { value: formik.values.Round, disabled: 'true' } : {}}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setFieldValue('Round', newValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  {/* <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} /> */}
                  {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  helperText={touched.Round && errors.Round}
                  error={Boolean(touched.Round && errors.Round)}
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
              getOptionDisabled={option => disableOption(option, values.HomeClub)}
              fullWidth
              options={clubList}
              autoHighlight
              value={values.HomeClub}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setFieldValue('HomeClub', newValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                  {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  helperText={touched.HomeClub && errors.HomeClub}
                  error={Boolean(touched.HomeClub && errors.HomeClub)}
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
              getOptionDisabled={option => disableOption(option, values.AwayClub)}
              fullWidth
              options={clubList}
              autoHighlight
              value={values.AwayClub}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setFieldValue('AwayClub', newValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                  {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  helperText={touched.AwayClub && errors.AwayClub}
                  error={Boolean(touched.AwayClub && errors.AwayClub)}
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
              options={stadiumList}
              autoHighlight
              {...isEdit ? { value: formik.values.Stadium, disabled: 'true' } : {}}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => {
                setFieldValue('Stadium', newValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                  {option.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  helperText={touched.Stadium && errors.Stadium}
                  error={Boolean(touched.Stadium && errors.Stadium)}
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
              label="Start date"
              disablePast
              value={values.StartDate}
              inputFormat="dd/MM/yyyy hh:mm a"
              onChange={(StartDate) => setFieldValue('StartDate', StartDate)}
              renderInput={(params) => <TextField {...params} fullWidth
                helperText={touched.StartDate && errors.StartDate}
                error={Boolean(touched.StartDate && errors.StartDate)} />}
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
                    {values.HomeClub.name}
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
