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
//
import { useDispatch } from 'src/redux/store';
import { createContract as createPlayerContract, editContract as editPlayerContract, getPlayerList } from 'src/redux/slices/player'
import _ from 'lodash';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';


// ----------------------------------------------------------------------

ClubContractPlayerNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentContract: PropTypes.object,
  currentClub: PropTypes.object
};

export default function ClubContractPlayerNewForm({ isEdit, currentContract, currentClub }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { playerList } = useSelector(state => state.player)
  const NewClubSchema = Yup.object().shape({
    Number: Yup.mixed().required('Number is required'),
    Start: Yup.mixed().required('Start is required'),
    End: Yup.mixed().required('End is required'),
    Player: Yup.mixed().required('Player is required'),
    // Description: Yup.string().required('Description is required'),
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
      Player: currentContract?.player || null,
      Number: currentContract?.number || '',
      Club: currentClub,
    },
    validationSchema: NewClubSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        let data = ''
        if (isEdit) {
          data = {
            Salary: values.Salary,
            End: values.End,
            Description: values.Description,
            Number: values.Number,
          }
          dispatch(editPlayerContract(values.id, data, (value) => { setErrorState(value) }))
        } else {
          data = {
            PlayerID: values.Player.id,
            ClubID: values.Club.id,
            Number: values.Number,
            Salary: values.Salary,
            Start: values.Start,
            End: values.End,
            Description: values.Description
          }
          dispatch(createPlayerContract(data, (value) => { setErrorState(value) }))
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
    dispatch(getPlayerList())
  }, [dispatch])
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));
  const disableStartDate = (date) => {
    return new Date(date) > new Date(values.End)
  }
  const disableEndDate = (date) => {
    return new Date(date) < new Date(values.Start)
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
                    <SmallAvatar alt="Remy Sharp" src={values.Club?.imageURL} sx={{ width: 56.7, height: 56.7 }} />
                  }
                >
                  <Avatar alt="Travis Howard" src={values.Player?.imageURL} sx={{ width: 126, height: 126 }} />
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
                    options={playerList}
                    autoHighlight
                    value={values.Player}
                    disabled={isEdit}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setFieldValue('Player', newValue);
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
                        label="Player"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                  <TextField
                    type="number"
                    sx={{ width: 120 }}
                    label="Number"
                    // InputLabelProps={{ shrink: true }}
                    {...getFieldProps('Number')}
                    error={Boolean(touched.Number && errors.Number)}
                    helperText={touched.Number && errors.Number}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Stack direction={{ xs: 'row' }} spacing={3}>
                    <DatePicker
                      shouldDisableDate={(date) => disableStartDate(date)}
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
                      shouldDisableDate={(date) => disableEndDate(date)}
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
                      width={80}
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
                  // error={Boolean(touched.Description && errors.Description)}
                  // helperText={touched.Description && errors.Description}
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
