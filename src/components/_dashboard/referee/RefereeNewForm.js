import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Alert } from '@mui/material';
// utils
import { toBase64 } from 'src/utils/base64/base64';
import { fData } from '../../../utils/formatNumber';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import { UploadAvatar } from '../../upload';
import { createReferee, editReferee } from 'src/redux/slices/referee';
import { useDispatch } from 'src/redux/store';
import _ from 'lodash';
import useAuth from 'src/hooks/useAuth';
import { FAILURE, SUCCESS } from 'src/config';
import handleUploadImage from 'src/utils/uploadImage';

// ----------------------------------------------------------------------

RefereeNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentReferee: PropTypes.object
};

export default function RefereeNewForm({ isEdit, currentReferee }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState()
  const { enqueueSnackbar } = useSnackbar();
  const NewRefereeSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    imageURL: Yup.mixed().required('Avatar is required')
  });
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      if (errorState.status === SUCCESS) {
        formik.resetForm();
        enqueueSnackbar(errorState.message, { variant: 'success' });
        navigate(PATH_DASHBOARD.referee.list);
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
      }
    }
  }, [errorState])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentReferee?.id || '',
      name: currentReferee?.name || '',
      imageURL: currentReferee?.imageURL || null,

    },
    validationSchema: NewRefereeSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const url = values.imageURL?.preview !== undefined ? await handleUploadImage(values.imageURL) : values.imageURL
        const data = {
          id: values.id,
          name: values.name,
          imageURL: url
        }
        if (isEdit) {
          dispatch(editReferee(data, error => setErrorState(error)))
        } else {
          dispatch(createReferee(data, error => setErrorState(error)))
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
                </Stack>
                {errorState?.status === FAILURE ? <Alert severity="warning">{errorState.message}</Alert> : ''}

                {isAdmin && (<Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Referee' : 'Save Changes'}
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
