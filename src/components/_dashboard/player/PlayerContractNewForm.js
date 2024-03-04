import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { DatePicker, LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Avatar, TextareaAutosize, Autocomplete, Alert } from '@mui/material';
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
import { createContract, createPlayer, editContract, editPlayer, getPlayerList } from 'src/redux/slices/player';
import { useDispatch, useSelector } from 'src/redux/store';
import _ from 'lodash';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { getClubList } from 'src/redux/slices/club';
import useAuth from 'src/hooks/useAuth';
import { FAILURE, SUCCESS } from 'src/config';

// ----------------------------------------------------------------------

PlayerContractNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentContract: PropTypes.object
};

export default function PlayerContractNewForm({ isEdit, currentContract }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { clubList } = useSelector((state) => state.club);
  const [player] = useState(currentContract.player)
  const { playerList, error } = useSelector((state) => state.player);
  const [errorState, setErrorState] = useState()
  const NewPlayerSchema = Yup.object().shape({
    club: Yup.mixed().required('Club is required'),
    player: Yup.mixed().required('Player is required'),
    salary: Yup.number().required('Salary is required').min(4000000, 'Salary have more than 4,000,000 vnd'),
    start: Yup.mixed().required('Start date is required'),
    end: Yup.mixed().required('End date is required'),
    number: Yup.number().required('Number is required').min(Number(1))
  });
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  useEffect(() => {
    dispatch(getClubList(0, 1000))
    dispatch(getPlayerList(0, 1000))
  }, [dispatch])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentContract?.id || '',
      salary: currentContract?.salary || '',
      start: currentContract?.start || '',
      end: currentContract?.end || '',
      description: currentContract?.description || '',
      player: currentContract?.player || null,
      club: currentContract?.club || null,
      number: currentContract?.number || ''
    },
    validationSchema: NewPlayerSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let data = ''
        if (isEdit) {
          data = {
            number: values.number,
            salary: values.salary,
            end: values.end,
            description: values.description
          }
         await dispatch(editContract(values.id, data, (value) => { setErrorState(value) }))
        } else {
          data = {
            playerId: values.player.id,
            clubId: values.club.id,
            number: values.number,
            salary: values.salary,
            start: values.start,
            end: values.end,
            description: values.description
          }
         await dispatch(createContract(data, (value) => { setErrorState(value) }))
        }
        console.log('sadasdasdasdasddad');
      } catch (error) {
        setSubmitting(false);
        setErrors(error.data);

        console.log('errpr', error);
      }
    }
  });
  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      if (errorState.status === SUCCESS) {
        formik.resetForm();
        enqueueSnackbar(errorState.message, { variant: 'success' });
        navigate(PATH_DASHBOARD.player.contract);
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
        // formik.setSubmitting(false)
        // if (errorState) {
        //   formik.setErrors(errorState.data)
        // }
      }
    }

  }, [errorState])
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const disableStartDate = (date) => {
    return new Date(date) > new Date(values.end)
  }
  const disableEndDate = (date) => {
    return new Date(date) < new Date(values.start)
  }
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              {/* {isEdit && (
                <Label
                  color={values.status !== 'active' ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status}
                </Label>
              )} */}

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <SmallAvatar alt="Remy Sharp" src={values.club?.imageURL} sx={{ width: 56.7, height: 56.7 }} />
                  }
                >
                  <Avatar alt="Travis Howard" src={values.player?.imageURL} sx={{ width: 126, height: 126 }} />
                </Badge>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Autocomplete
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    fullWidth
                    options={playerList.data}
                    autoHighlight
                    disabled={isEdit || !isAdmin}
                    value={values.player}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('player', newValue);
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar alt={option.name} src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        helperText={touched.player && errors.player}
                        error={Boolean(touched.player && errors.player)}
                        {...params}
                        label="Player"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                  <Autocomplete
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    fullWidth
                    options={clubList.data}
                    autoHighlight
                    disabled={isEdit || !isAdmin}
                    value={values.club}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('club', newValue);
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        helperText={touched.club && errors.club}
                        error={Boolean(touched.club && errors.club)}
                        {...params}
                        label="Club"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />

                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Stack direction={{ xs: 'row' }} spacing={3}>
                    <DatePicker

                      shouldDisableDate={(date) => disableStartDate(date)}
                      inputFormat='dd/MM/yyyy'
                      disabled={isEdit || !isAdmin}
                      label="Start"
                      openTo="year"
                      views={['year', 'month', 'day']}
                      value={values.start}
                      onChange={(newValue) => {
                        setFieldValue('start', newValue);
                      }}
                      renderInput={(params) => <TextField {...params} error={Boolean(touched.start && errors.start)}
                        helperText={touched.start && errors.start} />}
                    />
                    <DatePicker
                      disabled={!isAdmin}

                      shouldDisableDate={(date) => disableEndDate(date)}
                      inputFormat='dd/MM/yyyy'
                      label="End"
                      openTo="year"
                      views={['year', 'month', 'day']}
                      value={values.end}
                      onChange={(newValue) => {
                        setFieldValue('end', newValue);
                      }}
                      renderInput={(params) => <TextField {...params} error={Boolean(touched.end && errors.end)}
                        helperText={touched.end && errors.end} />}
                    />
                  </Stack>


                  <Stack direction={{ xs: 'row' }} spacing={3}>
                    <TextField
                      InputProps={{
                        readOnly: !isAdmin,
                      }}
                      label="Salary"
                      {...getFieldProps('salary')}
                      error={Boolean(touched.salary && errors.salary)}
                      helperText={touched.salary && errors.salary}
                    />
                    <TextField
                      InputProps={{
                        readOnly: !isAdmin,
                      }}
                      type="number"
                      sx={{ width: 110 }}
                      label="Number"
                      InputLabelProps={{ shrink: true }}
                      {...getFieldProps('number')}
                      error={Boolean(touched.number && errors.number)}
                      helperText={touched.number && errors.number}
                    />
                  </Stack>
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <TextField
                    InputProps={{
                      readOnly: !isAdmin,
                    }}
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={5}
                    label="Description"
                    {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                  />
                </Stack>
                {errorState?.status === FAILURE ? <Alert severity="warning">{errorState?.message}</Alert> : ''}

                {isAdmin && (<Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Contract' : 'Save Changes'}
                  </LoadingButton>
                </Box>)}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider >
  );
}
