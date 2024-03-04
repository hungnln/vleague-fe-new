import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { DatePicker, LoadingButton, MobileDateTimePicker } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Button, DialogActions, Autocomplete, Avatar, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
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
import { addActivity, createMatch, editMatch } from 'src/redux/slices/match';
import { useDispatch } from 'src/redux/store';
import _ from 'lodash';
import { getClubList } from 'src/redux/slices/club';
import { getStadiumList } from 'src/redux/slices/stadium';
import { useSelector } from 'react-redux';
import { getMatchPlayerContract } from 'src/redux/slices/player';
import { type } from '@testing-library/user-event/dist/type';
import { FAILURE, SUCCESS } from 'src/config';

// ----------------------------------------------------------------------

EventNewForm.propTypes = {
  isEdit: PropTypes.bool,
  onCancel: PropTypes.func
};

export default function EventNewForm({ onCancel, isExtra, isSecondHalf }) {
  const dispatch = useDispatch();
  const { matchParticipation, currentMatch } = useSelector(state => state.match)
  const { homeLineUp, homeReverse, awayLineUp, awayReverse } = matchParticipation
  const { id, homeClub, awayClub, } = currentMatch
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { selectedHomePlayer, setSelectedHomePlayer } = useState([])

  const NewActivitySchema = Yup.object().shape({
    type: Yup.mixed().required("Type is required"),
    minuteInMatch: Yup.number().required("Minute in match is required"),
    club: Yup.mixed().required("Club is required"),
    player: Yup.array().required("Player is required").min(1),
  });
  const NewTimeActivitySchema = Yup.object().shape({
    type: Yup.mixed().required("Type is required"),
    minuteInMatch: Yup.number().required("Minute in match is required"),
  });
  const homePlayerLineUp = !_.isEmpty(homeLineUp) ? _.flatten([...Object.values(homeLineUp).map((player) => { return Array.isArray(player) ? [...player] : { ...player } })]) : []
  const awayPlayerLineUp = !_.isEmpty(awayLineUp) > 0 ? _.flatten([...Object.values(awayLineUp).map((player) => { return Array.isArray(player) ? [...player] : { ...player } })]) : []
  const homePlayerReverse = !_.isEmpty(homeReverse) > 0 ? _.flatten([...Object.values(homeReverse).map((player) => { return Array.isArray(player) ? [...player] : { ...player } })]) : []
  const awayPlayerReverse = !_.isEmpty(awayReverse) > 0 ? _.flatten([...Object.values(awayReverse).map((player) => { return Array.isArray(player) ? [...player] : { ...player } })]) : []
  const playerList = [...homePlayerLineUp, ...awayPlayerLineUp]
  const playerReverseList = [].concat(homePlayerReverse, awayPlayerReverse)
  const clubList = [{ ...homeClub }, { ...awayClub }]
  console.log(playerList,'playerList');
  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
    {
      type: isExtra ? 15 : 1,
      half: isSecondHalf ? 2 : 1,
      minuteInMatch: 0,
      club: null,
      player: [],
      playerReverse: [],
    },
    validationSchema: isExtra ? NewTimeActivitySchema : NewActivitySchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let data = ''
        if (values.type === 15) {
          data = {
            matchId: id,
            type: values.type,
            minuteInMatch: (!isSecondHalf ? (45 + values.minuteInMatch) : (90 + values.minuteInMatch)),
            playerContractIds: [],
            staffContractIds: [],
            refereeIds: [],
          }
          dispatch(addActivity(data, (value) => { if (isSecondHalf && value.status === FAILURE) { dispatch(addActivity({ ...data, type: 17 }, value => { setErrorState(value) })) } else { setErrorState(value) } }))
        } else {
          if (values.player.length > 0) {
            if (values.type !== 18) {
              data = {
                matchId: id,
                type: values.type,
                minuteInMatch: values.minuteInMatch,
                playerContractIds: [...values.player.reduce((obj, value) => { return [...obj, value.id] }, [])],
                staffContractIds: [],
                refereeIds: [],
              }
              // console.log("checkdata", data);
              dispatch(addActivity(data, (value) => { setErrorState(value); }))
            }
            else {
              if (values.player.length === values.playerReverse.length) {
                data = {
                  matchId: id,
                  type: values.type,
                  minuteInMatch: values.minuteInMatch,
                  playerContractIds: [...values.player.reduce((obj, value) => { return [...obj, value.id] }, []), ...values.playerReverse.reduce((obj, value) => { return [...obj, value.id] }, [])],
                  staffContractIds: [],
                  refereeIds: [],
                }
                dispatch(addActivity(data, (value) => { setErrorState(value); }))
              } else {
                setErrorState({ status: FAILURE, message: "Lineups and Reverse must be equal" })
              }
            }
          } else {
            setErrorState({ status: FAILURE, message: "Player is required" })
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
      if (errorState.status === SUCCESS) {
        formik.resetForm();
        onCancel();
        enqueueSnackbar(errorState.message, { variant: 'success' });
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
        formik.setSubmitting(false);
      }
    }

  }, [errorState])
  const types = [
    { id: 1, label: "Goal" },
    { id: 2, label: "Own Goal" },
    { id: 3, label: "Red Card" },
    { id: 4, label: "Yellow Card" },
    { id: 5, label: "Foul" },
    { id: 6, label: "Offside" },
    { id: 7, label: "Kick off" },
    { id: 8, label: "Penalty" },
    { id: 9, label: "Corner" },
    { id: 10, label: "Thrown In" },
    { id: 11, label: "Header" },
    { id: 12, label: "Back Heal" },
    { id: 15, label: "Extra Time" },
    { id: 18, label: "Substitution" },

  ]
  const halfs = [{ id: 1, label: "First Half" }, { id: 2, label: "Second Half" }]
  const disableOption = (option, field) => {
    return !!playerReverseList.filter(option => option.clubId === values.club.id)?.find(element => element?.id === option?.id) && values.playerReverse.length >= values.player.length && !field.find(element => element?.id === option?.id)
  }
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  useEffect(() => { console.log("home player", values.player); }, [values.player])
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12}>
            <Stack direction='row' spacing={{ xs: 3, sm: 2 }}>
              <FormControl sx={{ minWidth: 80 }}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  autoWidth
                  value={values.type}
                  disabled={isExtra}
                  label="Type"
                  onChange={(event) => setFieldValue('type', event.target.value)}
                  error={Boolean(touched.type && errors.type)}
                  helperText={touched.type && errors.type}
                >
                  {types.map((type, index) => {
                    return <MenuItem value={type.id}>{type.label}</MenuItem>
                  })}
                </Select>
              </FormControl>

              {values.type === 15 && (
                <FormControl sx={{ minWidth: 80 }}>
                  <InputLabel id="demo-simple-select-label">Half</InputLabel>
                  <Select
                    disabled
                    placeholder='Choose half'
                    sx={{ width: 150 }}
                    value={values.half}
                    label="Half"
                    onChange={(event) => setFieldValue('half', event.target.value)}
                    error={Boolean(touched.half && errors.half)}
                    helperText={touched.half && errors.half}
                  >
                    {halfs.map((half, index) => {
                      return <MenuItem value={half.id}>{half.label}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              )}
              <TextField
                sx={{ width: 80 }}
                type="number"
                label="Minute"
                InputProps={{
                  shrink: true,
                }}
                onChange={(event, value) => setFieldValue('minuteInMatch', value)}
                {...getFieldProps('minuteInMatch')}
                error={Boolean(touched.minuteInMatch && errors.minuteInMatch)}
                helperText={touched.minuteInMatch && errors.minuteInMatch}
              />

            </Stack>

          </Grid>

          {values.type !== 15 && (
            <Grid item xs={12}>
              <Stack direction='column' spacing={{ xs: 3, sm: 2 }}>


                <Autocomplete
                  fullWidth
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  autoHighlight
                  options={clubList}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => { setFieldValue('club', value) }}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <Avatar alt={option?.name} src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                      {option.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      error={Boolean(touched.club && errors.club)}
                      helperText={touched.club && errors.club}
                      {...params}
                      label="Club"
                      InputProps={{
                        ...params.InputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }} />
                  )}
                />
                <Autocomplete
                  fullWidth
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  multiple
                  limitTags={2}
                  autoHighlight
                  options={playerList.filter(option => option.club.id === values.club?.id)}
                  getOptionLabel={(option) => option?.player.name}
                  // getOptionDisabled={option => disableOption(option, values.Forward)}
                  onChange={(event, value) => { setFieldValue('player', value) }}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <Avatar alt={option?.player.name} src={option?.player.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                      {option.player.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      error={Boolean(touched.player && errors.player)}
                      helperText={touched.player && errors.player}
                      {...params}
                      label="Player"
                      InputProps={{
                        ...params.InputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }} />
                  )}
                />
                {values.type === 18 && (
                  <Autocomplete
                    fullWidth
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    multiple
                    limitTags={2}
                    autoHighlight
                    options={playerReverseList.filter(option => option.club.id === values.club?.id)}
                    getOptionLabel={(option) => option?.player.name}
                    getOptionDisabled={option => disableOption(option, values.playerReverse)}
                    // getOptionDisabled={option => disableOption(option, values.Forward)}
                    onChange={(event, value) => { setFieldValue('playerReverse', value) }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar alt={option?.player.name} src={option?.player.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.player.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Reverse"
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                        }} />
                    )}
                  />
                )}


              </Stack>

            </Grid>

          )}
          <Grid item xs={12}>
            <Stack direction='column' spacing={{ xs: 3, sm: 2 }}>
              {errorState?.status === FAILURE ? <Alert severity="warning">{errorState?.message}</Alert> : ''}
            </Stack>
          </Grid>

        </Grid>
        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Add
          </LoadingButton>

        </DialogActions>
      </Form>
    </FormikProvider >
  );
}
