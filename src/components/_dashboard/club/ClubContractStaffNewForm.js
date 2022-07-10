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


// ----------------------------------------------------------------------

ClubContractStaffNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentContract: PropTypes.object,
  currentClub: PropTypes.object
};

export default function ClubContractStaffNewForm({ isEdit, currentContract, currentClub }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { staffList } = useSelector(state => state.staff)
  const NewClubSchema = Yup.object().shape({
    Start: Yup.mixed().required('Start is required'),
    End: Yup.mixed().required('End is required'),
    Staff: Yup.mixed().required('Staff is required'),
    Description: Yup.string().required('Description is required'),
    Salary: Yup.number().required('Salary is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentContract?.id || '',
      Salary: currentContract?.salary || '',
      Start: currentContract?.start || '',
      End: currentContract?.end || '',
      Description: currentContract?.description || '',
      Staff: currentContract?.staff || null,
      Club: currentClub,
    },
    validationSchema: NewClubSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let data = ''
        if (isEdit) {
          data = {
            Salary: values.Salary,
            End: values.End,
            Description: values.Description,
          }
          dispatch(editStaffContract(values.id, data, (value) => { setErrorState(value) }))
        } else {
          data = {
            StaffID: values.Staff.id,
            ClubID: values.Club.id,
            Salary: values.Salary,
            Start: values.Start,
            End: values.End,
            Description: values.Description
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
      if (!errorState.isError) {
        formik.resetForm();
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(`${PATH_DASHBOARD.club.contract}/${currentClub.id}`);
      }
    }

  }, [errorState])
  useEffect(() => {
    dispatch(getStaffList())

  }, [dispatch])
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));
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
                  <Avatar alt="Travis Howard" src={values.Staff?.imageURL} sx={{ width: 126, height: 126 }} />
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
                    options={staffList}
                    autoHighlight
                    value={values.Staff}
                    disabled={isEdit}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('Staff', newValue);
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
                    error={Boolean(touched.Description && errors.Description)}
                    helperText={touched.Description && errors.Description}
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
