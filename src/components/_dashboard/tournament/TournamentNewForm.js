import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { DatePicker, LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Alert } from '@mui/material';
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
import { createTournament, editTournament } from 'src/redux/slices/tournament';
import { useDispatch } from 'src/redux/store';
import _ from 'lodash';

// ----------------------------------------------------------------------

TournamentNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTournament: PropTypes.object
};

export default function TournamentNewForm({ onCancel, currentTournament }) {
  const dispatch = useDispatch();
  const isEdit = !_.isEmpty(currentTournament)
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const NewTournamentSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    From: Yup.mixed().required('Date begin is required'),
    To: Yup.mixed().required('Date end is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentTournament?.id || '',
      Name: currentTournament?.name || '',
      From: currentTournament?.from || '',
      To: currentTournament?.to || ''
    },
    validationSchema: NewTournamentSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isEdit) {
          dispatch(editTournament(values, (value) => setErrorState(value)))
        } else {
          dispatch(createTournament(values, (value) => setErrorState(value)))
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
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        onCancel()
      }
    }

  }, [errorState])
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', }} spacing={3}>
              <TextField
                fullWidth
                label="Name"
                {...getFieldProps('Name')}
                error={Boolean(touched.Name && errors.Name)}
                helperText={touched.Name && errors.Name}
              />
              <DatePicker
                disabled={isEdit}
                label="From"
                openTo="year"
                views={['year', 'month', 'day']}
                value={values.From}
                onChange={(newValue) => {
                  setFieldValue('From', newValue);
                }}
                renderInput={(params) => <TextField {...params} error={Boolean(touched.From && errors.From)}
                  helperText={touched.From && errors.From} />}
              />
              <DatePicker
                disablePast
                label="To"
                openTo="year"
                views={['year', 'month', 'day']}
                value={values.To}
                onChange={(newValue) => {
                  setFieldValue('To', newValue);
                }}
                renderInput={(params) => <TextField {...params} error={Boolean(touched.To && errors.To)}
                  helperText={touched.To && errors.To} />}
              />
            </Stack>
            {errorState?.IsError ? <Alert severity="warning">{errorState.Message}</Alert> : ''}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Tournament' : 'Save Changes'}
              </LoadingButton>
            </Box>
          </Stack>
        </Card>
      </Form>
    </FormikProvider>
  );
}
