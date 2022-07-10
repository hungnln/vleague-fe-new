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
import { createPlayer, editPlayer } from 'src/redux/slices/player';
import { useDispatch } from 'src/redux/store';
import _ from 'lodash';

// ----------------------------------------------------------------------

PlayerNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPlayer: PropTypes.object
};

export default function PlayerNewForm({ isEdit, currentPlayer }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState()
  const { enqueueSnackbar } = useSnackbar();
  const NewPlayerSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    DateOfBirth: Yup.string().required('Birthday is required'),
    ImageURL: Yup.mixed().required('Avatar is required'),
    HeightCm: Yup.number().required('Height is required').min(0),
    WeightKg: Yup.number().required('Weight is required').min(0),

  });
  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      if (!errorState.IsError) {
        formik.resetForm();
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.player.list);
      }
    }

  }, [errorState])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentPlayer?.id || '',
      Name: currentPlayer?.name || '',
      DateOfBirth: currentPlayer?.dateOfBirth || '',
      HeightCm: currentPlayer?.heightCm || '',
      WeightKg: currentPlayer?.weightKg || '',
      ImageURL: currentPlayer?.imageURL || null,
    },
    validationSchema: NewPlayerSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let data = ''
        if (isEdit) {
          if (values.ImageURL?.base64 == null) {
            data = { ...values }
          } else {
            data = { ...values, ImageURL: values.ImageURL.base64 }
          }
          dispatch(editPlayer(data, value => setErrorState(value)))
        } else {
          data = { ...values, ImageURL: values.ImageURL.base64 }
          dispatch(createPlayer(data, value => setErrorState(value)))
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        toBase64(file).then(value => {
          setFieldValue('ImageURL', {
            ...file,
            preview: URL.createObjectURL(file), base64: value
          });
        })
      }
    },
    [setFieldValue]
  );

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

              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.ImageURL}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.ImageURL && errors.ImageURL)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.ImageURL && errors.ImageURL}
                </FormHelperText>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', }} spacing={3}>
                  <TextField
                    fullWidth
                    label="Full name"
                    {...getFieldProps('Name')}
                    error={Boolean(touched.Name && errors.Name)}
                    helperText={touched.Name && errors.Name}
                  />
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    <DatePicker
                      disableFuture
                      inputFormat='dd/MM/yyyy'
                      label="Birthday"
                      openTo="year"
                      views={['year', 'month', 'day']}
                      value={values.DateOfBirth}
                      onChange={(newValue) => {
                        setFieldValue('DateOfBirth', newValue);
                      }}
                      renderInput={(params) => <TextField {...params} error={Boolean(touched.DateOfBirth && errors.DateOfBirth)}
                        helperText={touched.DateOfBirth && errors.DateOfBirth} />}
                    />
                    <Stack direction="row" spacing={3}>
                      <TextField
                        type='number'
                        label="Heigh"
                        {...getFieldProps('HeightCm')}
                        error={Boolean(touched.HeightCm && errors.HeightCm)}
                        helperText={touched.HeightCm && errors.HeightCm}
                      />
                      <TextField
                        type='number'
                        label="Weight"
                        {...getFieldProps('WeightKg')}
                        error={Boolean(touched.WeightKg && errors.WeightKg)}
                        helperText={touched.WeightKg && errors.WeightKg}
                      />
                    </Stack>
                  </Stack>
                </Stack>
                {errorState?.IsError ? <Alert severity="warning">{errorState?.Message}</Alert> : ''}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Player' : 'Save Changes'}
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
