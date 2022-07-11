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

// ----------------------------------------------------------------------

EventNewForm.propTypes = {
  isEdit: PropTypes.bool,
  onCancel: PropTypes.func
};

export default function EventNewForm({ onCancel, isExtra, isSecondHalf }) {
  const dispatch = useDispatch();
  const { matchParticipation, currentMatch } = useSelector(state => state.match)
  const { HomeLineUp, HomeReverse, AwayLineUp, AwayReverse } = matchParticipation
  const { id, homeClub, awayClub, } = currentMatch
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { selectedHomePlayer, setSelectedHomePlayer } = useState([])
 
  const NewActivitySchema = Yup.object().shape({
    Type: Yup.mixed().required("Type is required"),
    MinuteInMatch: Yup.number().required("MinuteInMatch is required"),
    Club: Yup.mixed().required("Club is required"),
    Player: Yup.array().required("Player is required").min(1),
  });
  const NewTimeActivitySchema = Yup.object().shape({
    Type: Yup.mixed().required("Type is required"),
    MinuteInMatch: Yup.number().required("MinuteInMatch is required"),
  });
  const homePlayerLineUp = !_.isEmpty(HomeLineUp) ? _.flatten([...Object.values(HomeLineUp).map((player) => { return Array.isArray(player) ? [...player] : { ...player } })]) : []
  const awayPlayerLineUp = !_.isEmpty(AwayLineUp) > 0 ? _.flatten([...Object.values(AwayLineUp).map((player) => { return Array.isArray(player) ? [...player] : { ...player } })]) : []
  const homePlayerReverse = !_.isEmpty(HomeReverse) > 0 ? _.flatten([...Object.values(HomeReverse).map((player) => { return Array.isArray(player) ? [...player] : { ...player } })]) : []
  const awayPlayerReverse = !_.isEmpty(AwayReverse) > 0 ? _.flatten([...Object.values(AwayReverse).map((player) => { return Array.isArray(player) ? [...player] : { ...player } })]) : []
  const playerList = [].concat(homePlayerLineUp, awayPlayerLineUp)
  const playerReverseList = [].concat(homePlayerReverse, awayPlayerReverse)
  const clubList = [{ ...homeClub }, { ...awayClub }]
  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
    {
      Type: isExtra ? 15 : 1,
      Half: isSecondHalf ? 2 : 1,
      MinuteInMatch: 0,
      Club: null,
      Player: [],
      PlayerReverse: [],
    },
    validationSchema: isExtra ? NewTimeActivitySchema : NewActivitySchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let data = ''
        if (values.Type === 15) {
          data = {
            ID: id,
            Type: values.Type,
            MinuteInMatch: (!isSecondHalf ? (45 + values.MinuteInMatch) : (90 + values.MinuteInMatch)),
            PlayerContractIDs: [],
            StaffContractIDs: [],
            RefereeIDs: [],
          }
          dispatch(addActivity(data, (value) => { setErrorState(value); }))
        } else {
          if (values.Player.length > 0) {
            if (values.Type !== 18) {
              data = {
                ID: id,
                Type: values.Type,
                MinuteInMatch: values.MinuteInMatch,
                PlayerContractIDs: [...values.Player.reduce((obj, value) => { return [...obj, value.id] }, [])],
                StaffContractIDs: [],
                RefereeIDs: [],
              }
              // console.log("checkdata", data);
              dispatch(addActivity(data, (value) => { setErrorState(value); }))
            }
            else {
              if (values.Player.length === values.PlayerReverse.length) {
                data = {
                  ID: id,
                  Type: values.Type,
                  MinuteInMatch: values.MinuteInMatch,
                  PlayerContractIDs: [...values.Player.reduce((obj, value) => { return [...obj, value.id] }, []), ...values.PlayerReverse.reduce((obj, value) => { return [...obj, value.id] }, [])],
                  StaffContractIDs: [],
                  RefereeIDs: [],
                }
                dispatch(addActivity(data, (value) => { setErrorState(value); }))
              } else {
                setErrorState({ IsError: true, Message: "Lineups and Reverse must be equal" })
              }
            }
          } else {
            setErrorState({ IsError: true, Message: "Player is required" })
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
      if (!errorState.IsError) {
        formik.resetForm();
        onCancel();
        enqueueSnackbar('Create success', { variant: 'success' });
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
    return !!playerReverseList.filter(option => option.clubID === values.Club.id)?.find(element => element?.id === option?.id) && values.PlayerReverse.length >= values.Player.length && !field.find(element => element?.id === option?.id)
  }
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  useEffect(() => { console.log("home player", values.Player); }, [values.Player])
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
                  value={values.Type}
                  disabled={isExtra}
                  label="Type"
                  onChange={(event) => setFieldValue('Type', event.target.value)}
                  error={Boolean(touched.Type && errors.Type)}
                  helperText={touched.Type && errors.Type}
                >
                  {types.map((type, index) => {
                    return <MenuItem value={type.id}>{type.label}</MenuItem>
                  })}
                </Select>
              </FormControl>

              {values.Type === 15 && (
                <FormControl sx={{ minWidth: 80 }}>
                  <InputLabel id="demo-simple-select-label">Half</InputLabel>
                  <Select
                    disabled
                    placeholder='Choose half'
                    sx={{ width: 150 }}
                    value={values.Half}
                    label="Half"
                    onChange={(event) => setFieldValue('Half', event.target.value)}
                    error={Boolean(touched.Half && errors.Half)}
                    helperText={touched.Half && errors.Half}
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
                onChange={(event, value) => setFieldValue('MinuteInMatch', value)}
                {...getFieldProps('MinuteInMatch')}
                error={Boolean(touched.MinuteInMatch && errors.MinuteInMatch)}
                helperText={touched.MinuteInMatch && errors.MinuteInMatch}
              />

            </Stack>

          </Grid>

          {values.Type !== 15 && (
            <Grid item xs={12}>
              <Stack direction='column' spacing={{ xs: 3, sm: 2 }}>


                <Autocomplete
                  fullWidth
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  autoHighlight
                  options={clubList}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => { setFieldValue('Club', value) }}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <Avatar alt={option?.name} src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                      {option.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      error={Boolean(touched.Club && errors.Club)}
                      helperText={touched.Club && errors.Club}
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
                  options={playerList.filter(option => option.clubID === values.Club?.id)}
                  getOptionLabel={(option) => option?.player.name}
                  // getOptionDisabled={option => disableOption(option, values.Forward)}
                  onChange={(event, value) => { setFieldValue('Player', value) }}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <Avatar alt={option?.player.name} src={option?.player.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                      {option.player.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      error={Boolean(touched.Player && errors.Player)}
                      helperText={touched.Player && errors.Player}
                      {...params}
                      label="Player"
                      InputProps={{
                        ...params.InputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }} />
                  )}
                />
                {values.Type === 18 && (
                  <Autocomplete
                    fullWidth
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    multiple
                    limitTags={2}
                    autoHighlight
                    options={playerReverseList.filter(option => option.clubID === values.Club?.id)}
                    getOptionLabel={(option) => option?.player.name}
                    getOptionDisabled={option => disableOption(option, values.PlayerReverse)}
                    // getOptionDisabled={option => disableOption(option, values.Forward)}
                    onChange={(event, value) => { setFieldValue('PlayerReverse', value) }}
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
              {errorState?.IsError ? <Alert severity="warning">{errorState.Message}</Alert> : ''}
            </Stack>
          </Grid>

        </Grid>
        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
            Add
          </LoadingButton>

        </DialogActions>
      </Form>
    </FormikProvider >
  );
}
