import * as Yup from 'yup';
import PropTypes, { element } from 'prop-types';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { DatePicker, LoadingButton, MobileDateTimePicker } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Button, DialogActions, Autocomplete, Avatar, CircularProgress, Alert } from '@mui/material';
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
import { createMatch, editMatch } from 'src/redux/slices/match';
import { useDispatch } from 'src/redux/store';
import _, { isError } from 'lodash';
import { getClubList } from 'src/redux/slices/club';
import { getStadiumList } from 'src/redux/slices/stadium';
import { useSelector } from 'react-redux';
import { getClubMatchContract, getMatchRefereeContract, getRefereeList } from 'src/redux/slices/referee';

// ----------------------------------------------------------------------

MatchRefereeForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMatch: PropTypes.object,
  onCancel: PropTypes.func
};

export default function MatchRefereeForm({ onCancel, addMember, currentRefereeList }) {
  const { lineup } = useSelector((state) => state.match);
  const { Referee } = lineup
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { refereeList } = useSelector(state => state.referee)
  const [selectedReferee, setSelectedReferee] = useState([])
  const [selected, setSelected] = useState([])
  const NewMatchRefereeSchema = Yup.object().shape({
    HeadReferee: Yup.mixed().required('Head Referee is required'),
    AssistantReferee: Yup.array().required('AssistantReferee is required').min(2, "AssistantReferee must have at least 2 referee"),
    MonitoringReferee: Yup.array().required('MonitoringReferee is required').min(1, "AssistantReferee is required"),

  });
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  useEffect(() => {
    const active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      if (active && refereeList.length !== 0) {
        setOptions([...refereeList]);
      }
    })();
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  const isEdit = !_.isEmpty(currentRefereeList)
  useEffect(() => {
    dispatch(getRefereeList())
  }, [dispatch])
  console.log('selected', selectedReferee);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      HeadReferee: currentRefereeList?.HeadReferee || null,
      AssistantReferee: currentRefereeList?.AssistantReferee || [],
      MonitoringReferee: currentRefereeList?.MonitoringReferee || [],
    },
    validationSchema: NewMatchRefereeSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        addMember(values)
        onCancel()
        enqueueSnackbar(currentRefereeList ? 'Create success' : 'Update success', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });
  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      console.log('check state', errorState);
      if (!errorState.isError) {
        console.log('ko error');
        formik.resetForm();
        onCancel();
        enqueueSnackbar(currentRefereeList ? 'Create success' : 'Update success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.match.list);
      } else {
        console.log('bị error');
      }
    }

  }, [errorState])
  useEffect(() => {
    const RefereeSelected = !_.isEmpty(Referee) ? [Referee.HeadReferee, ...Referee.AssistantReferee, ...Referee.MonitoringReferee] : []
    setSelected([...RefereeSelected])
  }, [lineup])
  const disableOption = (option, field) => {
    return (!!selectedReferee?.find(element => element?.id === option?.id) || selectedReferee.length >= 11 || !!selected?.find(element => element?.id === option?.id)) && (Array.isArray(field) ? !field.find(element => element?.id === option?.id) : field?.id !== option?.id)
  }
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  useEffect(() => {
    setSelectedReferee([{ ...values.HeadReferee }, ...values.AssistantReferee, ...values.MonitoringReferee])
  }, [values])
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12}>
            <Stack direction='column' spacing={{ xs: 3, sm: 2 }}>
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={values.HeadReferee}
                // open={open}
                loading={loading}
                onOpen={() => {
                  setOpen(true);

                }}
                onClose={() => {
                  setOpen(false);
                }}

                autoHighlight
                options={options}
                getOptionDisabled={option => disableOption(option, values.HeadReferee)}
                getOptionLabel={(option) => option?.name}
                onChange={(event, value) => setFieldValue('HeadReferee', value)}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.name} src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option?.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    helperText={touched.HeadReferee && errors.HeadReferee}
                    error={Boolean(touched.HeadReferee && errors.HeadReferee)}
                    {...params}
                    label="Head Referee"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />
                )}
              />
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={values.AssistantReferee}
                // open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                loading={loading}
                multiple
                limitTags={2}
                autoHighlight
                options={options}
                getOptionLabel={(option) => option.name}
                getOptionDisabled={option => disableOption(option, values.AssistantReferee)}
                onChange={(event, value) => setFieldValue('AssistantReferee', value)}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.name} src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    helperText={touched.AssistantReferee && errors.AssistantReferee}
                    error={Boolean(touched.AssistantReferee && errors.AssistantReferee)}
                    {...params}
                    label="Assistant Referee"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />
                )}
              />
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={values.MonitoringReferee}
                get
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                loading={loading}
                multiple
                limitTags={2}
                autoHighlight
                options={refereeList}
                getOptionDisabled={option => disableOption(option, values.MonitoringReferee)}

                getOptionLabel={(option) => option.name}
                onChange={(event, value) => { setFieldValue('MonitoringReferee', value) }}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.name} src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    helperText={touched.MonitoringReferee && errors.MonitoringReferee}
                    error={Boolean(touched.MonitoringReferee && errors.MonitoringReferee)}
                    {...params}
                    label="Monitoring Referee"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />
                )}
              />
            </Stack>
          </Grid>

        </Grid>
        {errorState?.isError ? <Alert sx={{ mx: 3 }} severity="warning">{errorState.Message}</Alert> : ''}

        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
            {!isEdit ? 'Add Referee' : 'Save Changes'}
          </LoadingButton>

        </DialogActions>
      </Form>
    </FormikProvider >
  );
}
