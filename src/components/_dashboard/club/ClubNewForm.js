import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Autocomplete, Avatar, Alert, Backdrop, CircularProgress } from '@mui/material';
// utils
import { toBase64 } from 'src/utils/base64/base64';
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadAvatar } from '../../upload';
import { createClub, editClub } from 'src/redux/slices/club';
import { useDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { getStadiumList } from 'src/redux/slices/stadium';
import _ from 'lodash';
import useAuth from 'src/hooks/useAuth';
import handleUploadImage from 'src/utils/uploadImage';
import { FAILURE, SUCCESS } from 'src/config';

// ----------------------------------------------------------------------

ClubNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentClub: PropTypes.object
};

export default function ClubNewForm({ isEdit, currentClub }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [errorState, setErrorState] = useState();
  const { stadiumList } = useSelector(state => state.stadium)
  const NewClubSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    stadium: Yup.mixed().required('Stadium is required'),
    imageURL: Yup.mixed().required('Avatar is required'),
    headQuarter: Yup.mixed().required('HeadQuarter is required')
  });
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const [open, setOpen] = useState(true);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentClub?.id || '',
      name: currentClub?.name || '',
      stadium: currentClub?.stadium || null,
      imageURL: currentClub?.imageURL || '',
      headQuarter: currentClub?.headQuarter || ''
    },
    validationSchema: NewClubSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        console.log(values.imageURL?.preview);
        const url = values.imageURL?.preview !== undefined ? await handleUploadImage(values.imageURL) : values.imageURL
        const data = {
          id: values.id,
          name: values.name,
          stadiumId: values.stadium.id,
          headQuarter: values.headQuarter,
          imageURL: url
        }
        if (isEdit) {
          dispatch(editClub(data, error => setErrorState(error)))
        } else {
          dispatch(createClub(data, error => setErrorState(error)))
        }
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });
  useEffect(() => {
    console.log(errorState, "log error");
    if (!_.isEmpty(errorState)) {
      if (errorState.status === SUCCESS) {
        formik.resetForm();
        enqueueSnackbar(errorState.message, { variant: 'success' });
        navigate(PATH_DASHBOARD.club.list);
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
      }
    }
  }, [errorState])

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const file = acceptedFiles[0];
  //     if (file) {
  //       toBase64(file).then(value => {
  //         setFieldValue('imageURL', {
  //           ...file,
  //           preview: URL.createObjectURL(file), base64: value
  //         });
  //       })
  //     }
  //   },
  //   [setFieldValue]
  // );
  // const handleDrop = useCallback((acceptedFiles) => {
  //   const file = acceptedFiles[0];
  //   if (file) {
  //     setFieldValue('imageURL',
  //         Object.assign(file, {
  //           preview: URL.createObjectURL(file)
  //         }));
  //   }
  // }, [setFieldValue]);
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
                    fullWidth
                    label="Full name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    InputProps={{
                      readOnly: !isAdmin,
                    }}
                  />
                  <TextField
                    InputProps={{
                      readOnly: !isAdmin,
                    }}
                    fullWidth
                    label="HeadQuarter"
                    {...getFieldProps('headQuarter')}
                    error={Boolean(touched.headQuarter && errors.headQuarter)}
                    helperText={touched.headQuarter && errors.headQuarter}
                  />
                  <Autocomplete
                    disabled={!isAdmin}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    fullWidth
                    options={stadiumList.data}
                    autoHighlight
                    value={values.stadium}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('stadium', newValue);
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        helperText={touched.stadium && errors.stadium}
                        error={Boolean(touched.stadium && errors.stadium)}
                        {...params}
                        label="Stadium"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </Stack>
                {errorState?.status === FAILURE ? <Alert severity="warning">{errorState?.message}</Alert> : ''}
                {isAdmin && (<Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Club' : 'Save Changes'}
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
