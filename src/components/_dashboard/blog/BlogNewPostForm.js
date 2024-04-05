import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import {
  Card,
  Grid,
  Chip,
  Stack,
  Button,
  Switch,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
  FormControlLabel,
  Avatar,
  Box,
  Alert
} from '@mui/material';
// utils
import fakeRequest from '../../../utils/fakeRequest';
//
import { QuillEditor } from '../../editor';
import { UploadSingleFile } from '../../upload';
//
import BlogNewPostPreview from './BlogNewPostPreview';
import { toBase64 } from 'src/utils/base64/base64';
import { useDispatch, useSelector } from 'react-redux';
import { getPlayerList } from 'src/redux/slices/player';
import { getClubList } from 'src/redux/slices/club';
import { createPost, editPost } from 'src/redux/slices/blog';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { FAILURE, SUCCESS } from 'src/config';
import handleUploadImage from 'src/utils/uploadImage';

// ---------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subTitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

export default function BlogNewPostForm({ isEdit, currentPost }) {
  const { playerList } = useSelector(state => state.player)
  const { clubList } = useSelector(state => state.club)
  const [errorState, setErrorState] = useState();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const { id } = useParams()
  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    // description: Yup.string().required('Description is required'),
    content: Yup.string().required('Content is required'),
    thumbnailImageURL: Yup.mixed().required('Cover is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentPost?.id || '',
      title: currentPost?.title || '',
      content: currentPost?.content || '',
      thumbnailImageURL: currentPost?.thumbnailImageURL || null,
      playerIds: currentPost?.players?.data || [],
      clubIds: currentPost?.clubs?.data || [],
    },
    validationSchema: NewBlogSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const url = values.thumbnailImageURL?.preview !== undefined ? await handleUploadImage(values.thumbnailImageURL) : values.thumbnailImageURL
        const data = {
          id: values.id,
          playerIds: values.playerIds.reduce((obj, item) => [...obj, item.id], []),
          clubIds: values.clubIds.reduce((obj, item) => [...obj, item.id], []),
          title: values.title,
          content: values.content,
          thumbnailImageURL: url,
        }
        if (!isEdit) {
          await dispatch(createPost(data, (value) => { setErrorState(value); }))
        } else {
          await dispatch(editPost(data, (value) => { setErrorState(value); }))
        }
        // await fakeRequest(500);
        // resetForm();
        handleClosePreview();
        // setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error)
      }
    }
  });
  useEffect(() => {
    dispatch(getPlayerList(0, 1000))
    dispatch(getClubList(0, 1000))
  }, [dispatch])

  useEffect(() => {
    if (!_.isEmpty(errorState)) {
      if (errorState.status === SUCCESS) {
        formik.resetForm();
        enqueueSnackbar(errorState.message, { variant: 'success' });
        navigate(PATH_DASHBOARD.blog.root)
      }
      else {
        enqueueSnackbar(errorState.message, { variant: 'error' });
      }
    }
  }, [errorState])
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('thumbnailImageURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          }));
      }
    },
    [setFieldValue]
  );

  return (
    <>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Post Title"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />

                  {/* <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={5}
                    label="Description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  /> */}

                  <div>
                    <LabelStyle>Content</LabelStyle>
                    <QuillEditor
                      id="post-Content"
                      value={values.content}
                      onChange={(val) => setFieldValue('content', val)}
                      error={Boolean(touched.content && errors.content)}
                    />
                    {touched.content && errors.content && (
                      <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                        {touched.content && errors.content}
                      </FormHelperText>
                    )}
                  </div>

                  <div>
                    <LabelStyle>Cover</LabelStyle>
                    <UploadSingleFile
                      maxSize={3145728}
                      accept="image/*"
                      file={values.thumbnailImageURL}
                      onDrop={handleDrop}
                      error={Boolean(touched.thumbnailImageURL && errors.thumbnailImageURL)}
                    />
                    {touched.thumbnailImageURL && errors.thumbnailImageURL && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {touched.thumbnailImageURL && errors.thumbnailImageURL}
                      </FormHelperText>
                    )}
                  </div>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* <div>
                    <FormControlLabel
                      control={<Switch {...getFieldProps('publish')} checked={values.publish} />}
                      label="Publish"
                      labelPlacement="start"
                      sx={{ mb: 1, mx: 0, width: '100%', justifyContent: 'space-between' }}
                    />

                    <FormControlLabel
                      control={<Switch {...getFieldProps('comments')} checked={values.comments} />}
                      label="Enable comments"
                      labelPlacement="start"
                      sx={{ mx: 0, width: '100%', justifyContent: 'space-between' }}
                    />
                  </div> */}

                  <Autocomplete

                    autoHighlight
                    multiple
                    limitTags={2}
                    value={values.playerIds}
                    onChange={(event, newValue) => {
                      setFieldValue('playerIds', newValue);
                    }}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} key={option.id} {...props}>
                        <Avatar alt={option?.name} src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.name}
                      </Box>
                    )}
                    options={playerList.data}
                    renderInput={(params) => <TextField {...params} label="Player tag" InputProps={{
                      ...params.InputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />}
                  />

                  {/* <TextField fullWidth label="Meta Title" {...getFieldProps('metaTitle')} />

                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={5}
                    label="Meta description"
                    {...getFieldProps('metaDescription')}
                  /> */}

                  <Autocomplete
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    autoHighlight
                    multiple
                    limitTags={2}
                    value={values.clubIds}
                    onChange={(event, newValue) => {
                      setFieldValue('clubIds', newValue);
                    }}
                    getOptionLabel={(option) => option.name}
                    options={clubList.data}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar alt={option?.name} src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => <TextField {...params} label="Club tag" InputProps={{
                      ...params.InputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />}
                  />
                  {errorState?.status === FAILURE ? <Alert severity="warning">{errorState?.message}</Alert> : ''}


                </Stack>
              </Card>

              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  type="button"
                  color="inherit"
                  variant="outlined"
                  size="large"
                  onClick={handleOpenPreview}
                  sx={{ mr: 1.5 }}
                >
                  Preview
                </Button>
                <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Post
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>

      <BlogNewPostPreview formik={formik} openPreview={open} onClosePreview={handleClosePreview} />
    </>
  );
}
