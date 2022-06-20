import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { DatePicker, LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel, Button, DialogActions } from '@mui/material';
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
import { createRound, editRound } from 'src/redux/slices/round';
import { useDispatch } from 'src/redux/store';
import _ from 'lodash';

// ----------------------------------------------------------------------

RoundNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentRound: PropTypes.object,
  onCancel: PropTypes.func
};

export default function RoundNewForm({ tournamentID, currentRound, onCancel }) {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [errorState, setErrorState] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const NewRoundSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
  });
  const isEdit = !_.isEmpty(currentRound) ? 1 : 0

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentRound?.id || '',
      TournamentID: currentRound?.tournamentID || tournamentID,
      Name: currentRound?.name || '',
    },
    validationSchema: NewRoundSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isEdit) {
          dispatch(editRound(values, (value) => setErrorState(value)))
        } else {
          dispatch(createRound(values, (value) => setErrorState(value)))
        }
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

      if (!errorState.IsError) {
        console.log('ko error');
        formik.resetForm();
        onCancel();
        enqueueSnackbar(currentRound ? 'Create success' : 'Update success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.round.list);
      } else {
        console.log('bị error');
      }
    }

  }, [errorState])
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Name"
            {...getFieldProps('Name')}
            error={Boolean(touched.Name && errors.Name)}
            helperText={touched.Name && errors.Name}
          />
        </Stack>
        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
            {!isEdit ? 'Create Round' : 'Save Changes'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
