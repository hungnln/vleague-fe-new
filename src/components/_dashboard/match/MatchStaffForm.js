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
import { getClubMatchContract, getMatchStaffContract } from 'src/redux/slices/staff';

// ----------------------------------------------------------------------

MatchStaffForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMatch: PropTypes.object,
  onCancel: PropTypes.func
};

export default function MatchStaffForm({ onCancel, clubId, addMember, currentStaffList }) {
  const dispatch = useDispatch();
  const { currentMatch, matchParticiation, lineup } = useSelector((state) => state.match);
  const { HomeStaff, AwayStaff } = lineup
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { clubContractList } = useSelector(state => state.staff)
  const [selectedStaff, setSelectedStaff] = useState([])
  const [selected, setSelected] = useState([])
  const NewMatchStaffSchema = Yup.object().shape({
    HeadCoach: Yup.mixed().required('Head Coach is required'),

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
      if (active && clubContractList.length !== 0) {
        setOptions([...clubContractList]);
      }
    })();
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  const isEdit = !_.isEmpty(currentMatch)
  useEffect(() => {
    dispatch(getClubMatchContract(clubId))
  }, [dispatch])
  console.log('selected', selectedStaff);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      HeadCoach: currentStaffList?.HeadCoach || null,
      AssistantCoach: currentStaffList?.AssistantCoach || [],
      MedicalTeam: currentStaffList?.MedicalTeam || [],
    },
    validationSchema: NewMatchStaffSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        addMember(values)
        onCancel()
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
        enqueueSnackbar(currentMatch ? 'Create success' : 'Update success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.match.list);
      } else {
        console.log('bị error');
      }
    }

  }, [errorState])
  useEffect(() => {
    const HomeStaffSelected = !_.isEmpty(HomeStaff) ? [HomeStaff.HeadCoach, ...HomeStaff.AssistantCoach, ...HomeStaff.MedicalTeam] : []
    setSelected([...HomeStaffSelected])
  }, [lineup])
  const disableOption = (option, field) => {
    return (!!selectedStaff?.find(element => element?.id === option?.id) || selectedStaff.length >= 11 || !!selected?.find(element => element?.id === option?.id)) && (Array.isArray(field) ? !field.find(element => element?.id === option?.id) : field?.id !== option?.id)
  }
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  useEffect(() => {
    setSelectedStaff([{ ...values.HeadCoach }, ...values.AssistantCoach, ...values.MedicalTeam])
  }, [values])
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12}>
            <Stack direction='column' spacing={{ xs: 3, sm: 2 }}>
              <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={values.HeadCoach}
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
                getOptionDisabled={option => disableOption(option, values.HeadCoach)}
                getOptionLabel={(option) => option?.staff?.name}
                onChange={(event, value) => setFieldValue('HeadCoach', value)}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.staff.name} src={option?.staff.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option.staff.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Head Coach"
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
                value={values.AssistantCoach}
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
                getOptionLabel={(option) => option.staff.name}
                getOptionDisabled={option => disableOption(option, values.AssistantCoach)}
                onChange={(event, value) => setFieldValue('AssistantCoach', value)}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.staff.name} src={option?.staff.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option.staff.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assistant Coach"
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
                value={values.MedicalTeam}
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
                options={clubContractList}
                getOptionDisabled={option => disableOption(option, values.MedicalTeam)}

                getOptionLabel={(option) => option.staff.name}
                onChange={(event, value) => { setFieldValue('MedicalTeam', value) }}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option?.staff.name} src={option?.staff.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                    {option.staff.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Medical Team"
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
            {!isEdit ? 'Create Match' : 'Save Changes'}
          </LoadingButton>

        </DialogActions>
      </Form>
    </FormikProvider >
  );
}
