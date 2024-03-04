import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { DatePicker, LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Autocomplete, Avatar, Alert } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import { useDispatch } from 'src/redux/store';
import { createContract as createStaffContract, editContract as editStaffContract, getStaffList } from 'src/redux/slices/staff'
import _ from 'lodash';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import useAuth from 'src/hooks/useAuth';
import { FAILURE, SUCCESS } from 'src/config';


// ----------------------------------------------------------------------

ClubContractStaffNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentContract: PropTypes.object,
  currentClub: PropTypes.object
};

export default function ClubContractStaffNewForm({ isEdit, currentContract, currentClub }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { staffList } = useSelector(state => state.staff)
  const NewClubSchema = Yup.object().shape({
    start: Yup.mixed().required('Start is required'),
    end: Yup.mixed().required('End is required'),
    staff: Yup.mixed().required('Staff is required'),
    // Description: Yup.string().required('Description is required'),
    salary: Yup.number().required('Salary is required').min(4000000, 'Salary have more than 4,000,000 vnd'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentContract?.id || '',
      salary: currentContract?.salary || '',
      start: currentContract?.start || '',
      end: currentContract?.end || '',
      description: currentContract?.description || '',
      staff: currentContract?.staff || null,
      club: currentClub,
    },
    validationSchema: NewClubSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let data = ''
        if (isEdit) {
          data = {
            salary: values.salary,
            end: values.end,
            description: values.description,
          }
          dispatch(editStaffContract(values.id, data, (value) => { setErrorState(value) }))
        } else {
          data = {
            staffId: values.staff.id,
            clubId: values.club.id,
            salary: values.salary,
            start: values.start,
            end: values.end,
            description: values.description,
          }
          dispatch(createStaffContract(data, (value) => { setErrorState(value) }))
        }
      } catch (error) {
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      if (errorState.status === SUCCESS) {
        formik.resetForm();
        enqueueSnackbar(errorState.message, { variant: 'success' });
        navigate(`${PATH_DASHBOARD.club.contract}/${currentClub.id}`);
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
        formik.setSubmitting(false)
        if (errorState) {
          formik.setErrors(errorState.data)
        }
      }
    }
  }, [errorState])


  useEffect(() => {
    dispatch(getStaffList(0, 1000))

  }, [dispatch])
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));
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
                  <Avatar alt="Travis Howard" src={values.staff?.imageURL} sx={{ width: 126, height: 126 }} />
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
                    options={staffList.data}
                    autoHighlight
                    value={values.staff}
                    disabled={isEdit || !isAdmin}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('staff', newValue);
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
                        label="Staff"
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
                    label="description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Stack>
                {errorState?.status === FAILURE ? <Alert severity="warning">{errorState.message}</Alert> : ''}
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
