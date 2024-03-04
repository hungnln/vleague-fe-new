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
import useAuth from 'src/hooks/useAuth';
import { SUCCESS } from 'src/config';
import handleUploadImage from 'src/utils/uploadImage';

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
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const NewStadiumSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    imageURL: Yup.mixed().required('Avatar is required')
  });
  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      if (errorState.status === SUCCESS) {
        formik.resetForm();
        enqueueSnackbar(errorState.message, { variant: 'success' });
        navigate(PATH_DASHBOARD.stadium.list);
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
      }
    }
  }, [errorState])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentStadium?.id || '',
      name: currentStadium?.name || '',
      address: currentStadium?.address || '',
      imageURL: currentStadium?.imageURL || null,
    },
    validationSchema: NewStadiumSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const url = values.imageURL?.preview !== undefined ? await handleUploadImage(values.imageURL) : values.imageURL
        const data = {
          id: values.id,
          name: values.name,
          address: values.address,
          imageURL: url
        }
        if (isEdit) {
          dispatch(editStadium(data, error => setErrorState(error)))
        } else {
          dispatch(createStadium(data, error => setErrorState(error)))
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
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('imageURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          }));
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
                  file={values.imageURL}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.imageURL && errors.imageURL)}
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
                  {touched.imageURL && errors.imageURL}
                </FormHelperText>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', }} spacing={3}>
                  <TextField
                    InputProps={{
                      readOnly: !isAdmin,
                    }}
                    fullWidth
                    label="Full name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    InputProps={{
                      readOnly: !isAdmin,
                    }}
                    fullWidth
                    label="Address"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Stack>
                {errorState?.status ? <Alert severity="warning">{errorState?.message}</Alert> : ''}
                {isAdmin && (<Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Stadium' : 'Save Changes'}
                  </LoadingButton>
                </Box>)}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
