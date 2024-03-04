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
import { SUCCESS } from 'src/config';

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
    name: Yup.string().required('Name is required'),
  });
  const isEdit = !_.isEmpty(currentRound) ? 1 : 0

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentRound?.id || '',
      tournamentId: currentRound?.tournamentId || tournamentID,
      name: currentRound?.name || '',
    },
    validationSchema: NewRoundSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
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
      if (errorState.status === SUCCESS) {
        enqueueSnackbar(errorState.message, { variant: 'success' });
        formik.resetForm();
        onCancel();
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
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
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
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
