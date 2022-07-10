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
import { toBase64 } from 'src/utils/base64/base64';
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadAvatar } from '../../upload';
import { createStadium, editStadium } from 'src/redux/slices/stadium';
import { useDispatch } from 'src/redux/store';
import _ from 'lodash';

// ----------------------------------------------------------------------

StadiumNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentStadium: PropTypes.object
};

export default function StadiumNewForm({ isEdit, currentStadium }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState()
  const { enqueueSnackbar } = useSnackbar();
  const NewStadiumSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    Address: Yup.string().required('Address is required'),
    ImageURL: Yup.mixed().required('Avatar is required')
  });
  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      if (!errorState.IsError) {
        formik.resetForm();
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.stadium.list);
      }
    }

  }, [errorState])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentStadium?.id || '',
      Name: currentStadium?.name || '',
      Address: currentStadium?.address || '',
      ImageURL: currentStadium?.imageURL || null,
    },
    validationSchema: NewStadiumSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let data = ''
        if (isEdit) {
          if (values.ImageURL?.base64 == null) {
            data = { ...values }
          } else {
            data = { ...values, ImageURL: values.ImageURL.base64 }
          }
          dispatch(editStadium(data, value => setErrorState(value)))

        } else {
          data = { ...values }
          dispatch(createStadium(data, value => setErrorState(value)))
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
              {isEdit && (
                <Label
                  color={values.status !== 'active' ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status}
                </Label>
              )}

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

          <Grid item xs={12} md={4}>
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
                  <TextField
                    fullWidth
                    label="Address"
                    {...getFieldProps('Address')}
                    error={Boolean(touched.Address && errors.Address)}
                    helperText={touched.Address && errors.Address}
                  />
                </Stack>
                {errorState?.IsError ? <Alert severity="warning">{errorState?.Message}</Alert> : ''}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Stadium' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
