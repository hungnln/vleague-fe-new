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
    Name: Yup.string().required('Name is required'),
    Stadium: Yup.mixed().required('Stadium is required'),
    ImageURL: Yup.mixed().required('Avatar is required'),
    HeadQuarter: Yup.mixed().required('HeadQuarter is required')
  });
  const [open, setOpen] = useState(true);
  useEffect(() => {
    dispatch(getStadiumList())
  }, [dispatch])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentClub?.id || '',
      Name: currentClub?.name || '',
      Stadium: currentClub?.stadium || null,
      ImageURL: currentClub?.imageURL || '',
      HeadQuarter: currentClub?.headQuarter || ''
    },
    validationSchema: NewClubSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let data = ''
        if (isEdit) {
          if (values.ImageURL?.base64 == null) {
            data = { ...values, StadiumId: values.Stadium.id }
          } else {
            data = { ...values, ImageURL: values.ImageURL.base64, StadiumId: values.Stadium.id }
          }
          dispatch(editClub(data, error => setErrorState(error)))
        } else {
          data = { ...values, StadiumId: values.Stadium.id }
          dispatch(createClub(data, error => setErrorState(error)))
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
        navigate(PATH_DASHBOARD.club.list);
      }
    }
  }, [errorState])

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
                    label="HeadQuarter"
                    {...getFieldProps('HeadQuarter')}
                    error={Boolean(touched.HeadQuarter && errors.HeadQuarter)}
                    helperText={touched.HeadQuarter && errors.HeadQuarter}
                  />
                  <Autocomplete
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    fullWidth
                    options={stadiumList}
                    autoHighlight
                    value={values.Stadium}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('Stadium', newValue);
                    }}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar alt="Travis Howard" src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        helperText={touched.Stadium && errors.Stadium}
                        error={Boolean(touched.Stadium && errors.Stadium)}
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
                {errorState?.isError ? <Alert severity="warning">{errorState.Message}</Alert> : ''}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Club' : 'Save Changes'}
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
