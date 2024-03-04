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
import { FAILURE, SUCCESS } from 'src/config';

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
    name: Yup.string().required('Name is required'),
    start: Yup.mixed().required('Date start is required'),
    end: Yup.mixed().required('Date end is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentTournament?.id || '',
      name: currentTournament?.name || '',
      start: currentTournament?.start || '',
      end: currentTournament?.end || ''
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
      if (errorState.status === SUCCESS) {
        formik.resetForm();
        enqueueSnackbar(errorState.message, { variant: 'success' });
        onCancel()
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
        if (errorState.data !== null) {
          formik.setSubmitting(false);
          formik.setErrors(errorState.data);
        }
      }
    }
  }, [errorState])

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const disableFromDate = (date) => {
    return new Date(date) > new Date(values.end)
  }
  const disableToDate = (date) => {
    return new Date(date) < new Date(values.start)
  }
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', }} spacing={3}>
              <TextField
                fullWidth
                label="Name"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
              <DatePicker

                inputFormat='dd/MM/yyyy'
                shouldDisableDate={(date) => disableFromDate(date)}
                disabled={isEdit}
                label="start"
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
                inputFormat='dd/MM/yyyy'
                shouldDisableDate={(date) => disableToDate(date)}
                label="end"
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
            {errorState?.status === FAILURE ? <Alert severity="warning">{errorState?.message}</Alert> : ''}

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
