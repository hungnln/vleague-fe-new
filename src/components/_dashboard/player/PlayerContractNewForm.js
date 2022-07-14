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
    Club: Yup.mixed().required('Club is required'),
    Player: Yup.mixed().required('Player is required'),
    Salary: Yup.number().required('Salary is required'),
    Start: Yup.mixed().required('Start date is required'),
    End: Yup.mixed().required('End date is required'),
    Number: Yup.number().required('Number is required').min(Number(1))
  });
  useEffect(() => {
    dispatch(getClubList())
    dispatch(getPlayerList())
  }, [dispatch])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentContract?.id || '',
      Salary: currentContract?.salary || '',
      Start: currentContract?.start || '',
      End: currentContract?.end || '',
      Description: currentContract?.description || '',
      Player: currentContract?.player || null,
      Club: currentContract?.club || null,
      Number: currentContract?.number || ''
    },
    validationSchema: NewPlayerSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let data = ''
        if (isEdit) {
          data = {
            Number: values.Number,
            Salary: values.Salary,
            End: values.End,
            Description: values.Description
          }
          dispatch(editContract(values.id, data, (value) => { setErrorState(value); console.log(value, 'check state value') }))
        } else {
          data = {
            PlayerID: values.Player.id,
            ClubID: values.Club.id,
            Number: values.Number,
            Salary: values.Salary,
            Start: values.Start,
            End: values.End,
            Description: values.Description
          }
          dispatch(createContract(data, (value) => { setErrorState(value); console.log(value, 'check state value') }))
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
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.player.contract);
      }
    }

  }, [errorState])
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
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
                    <SmallAvatar alt="Remy Sharp" src={values.Club?.imageURL} sx={{ width: 56.7, height: 56.7 }} />
                  }
                >
                  <Avatar alt="Travis Howard" src={values.Player?.imageURL} sx={{ width: 126, height: 126 }} />
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
                    options={playerList}
                    autoHighlight
                    disabled={isEdit}
                    value={values.Player}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('Player', newValue);
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        helperText={touched.Player && errors.Player}
                        error={Boolean(touched.Player && errors.Player)}
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
                    options={clubList}
                    autoHighlight
                    disabled={isEdit}
                    value={values.Club}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('Club', newValue);
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        helperText={touched.Club && errors.Club}
                        error={Boolean(touched.Club && errors.Club)}
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
                      inputFormat='dd/MM/yyyy'
                      disabled={isEdit}
                      label="Start"
                      openTo="year"
                      views={['year', 'month', 'day']}
                      value={values.Start}
                      onChange={(newValue) => {
                        setFieldValue('Start', newValue);
                      }}
                      renderInput={(params) => <TextField {...params} error={Boolean(touched.Start && errors.Start)}
                        helperText={touched.Start && errors.Start} />}
                    />
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      disablePast
                      label="End"
                      openTo="year"
                      views={['year', 'month', 'day']}
                      value={values.End}
                      onChange={(newValue) => {
                        setFieldValue('End', newValue);
                      }}
                      renderInput={(params) => <TextField {...params} error={Boolean(touched.End && errors.End)}
                        helperText={touched.End && errors.End} />}
                    />
                  </Stack>


                  <Stack direction={{ xs: 'row' }} spacing={3}>
                    <TextField
                      label="Salary"
                      {...getFieldProps('Salary')}
                      error={Boolean(touched.Salary && errors.Salary)}
                      helperText={touched.Salary && errors.Salary}
                    />
                    <TextField
                      type="number"
                      sx={{ width: 110 }}
                      label="Number"
                      InputLabelProps={{ shrink: true }}
                      {...getFieldProps('Number')}
                      error={Boolean(touched.Number && errors.Number)}
                      helperText={touched.Number && errors.Number}
                    />
                  </Stack>
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={5}
                    label="Description"
                    {...getFieldProps('Description')}
                    // error={Boolean(touched.Description && errors.Description)}
                    // helperText={touched.Description && errors.Description}
                  />
                </Stack>
                {errorState?.IsError ? <Alert severity="warning">{errorState.Message}</Alert> : ''}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Contract' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider >
  );
}
