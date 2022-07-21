import { orderBy } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useCallback, useState } from 'react';
// material
import { Box, Grid, Button, Skeleton, Container, Stack, Avatar, Autocomplete, TextField } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAllPosts, getMorePosts } from '../../redux/slices/blog';
// hooks
import useSettings from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../components/_dashboard/blog';
import { Form, FormikProvider, useFormik } from 'formik';
import { getPlayerList } from 'src/redux/slices/player';
import { getClubList } from 'src/redux/slices/club';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  // { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' }
];

// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }
  // if (sortBy === 'popular') {
  //   return orderBy(posts, ['view'], ['desc']);
  // }
  return posts;
};

const SkeletonLoad = (
  <Grid container spacing={3} sx={{ mt: 2 }}>
    {[...Array(4)].map((_, index) => (
      <Grid item xs={12} md={3} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ height: 200, borderRadius: 2 }} />
        <Box sx={{ display: 'flex', mt: 1.5 }}>
          <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
          <Skeleton variant="text" sx={{ mx: 1, flexGrow: 1 }} />
        </Box>
      </Grid>
    ))}
  </Grid>
);

export default function BlogPosts() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState('latest');
  const { posts, hasMore, index, step } = useSelector((state) => state.blog);
  const sortedPosts = applySort(posts, filters);
  const { playerList } = useSelector(state => state.player)
  const { clubList } = useSelector(state => state.club)
  const onScroll = useCallback(() => dispatch(getMorePosts()), [dispatch]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      PlayerIDs: [],
      ClubIDs: [],
    },
  })
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  useEffect(() => {
    dispatch(getAllPosts(step, values.PlayerIDs, values.ClubIDs));
  }, [dispatch, step]);
  useEffect(() => { dispatch(getAllPosts(1, values.PlayerIDs, values.ClubIDs)) }, [values])
  const handleChangeSort = (event) => {
    setFilters(event.target.value);
  };
  useEffect(() => {
    dispatch(getPlayerList())
    dispatch(getClubList())
  }, [])

  return (
    <Page title="News: Posts | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="News"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'News', href: PATH_DASHBOARD.blog.root },
            { name: 'Posts' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.blog.newPost}
              startIcon={<Icon icon={plusFill} />}
            >
              New Post
            </Button>
          }
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}
            sx={{

              '& .MuiAutocomplete-noOptions': {
                display: 'none',

              },
              '.MuiAutocomplete-inputRoot': {
                flexWrap: 'nowrap !important'
              },
              ' .Mui-focused': {
                flexWrap: ' wrap !important'
              }
              ,

            }}>
            <BlogPostsSearch />

            <FormikProvider value={formik}>
              <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Autocomplete
                    // disablePortal
                    size="small"
                    sx={{ width: 200 }}

                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    autoHighlight
                    multiple
                    limitTags={1}
                    value={values.PlayerIDs}
                    onChange={(event, newValue) => {
                      setFieldValue('PlayerIDs', newValue);
                    }}
                    getOptionLabel={(option) => option.name}
                    options={playerList}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar alt={option?.name} src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => <TextField {...params} placeholder="Player" InputProps={{
                      ...params.InputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />}
                  />
                  <Autocomplete
                    // disablePortal
                    size="small"
                    sx={{ width: 200 }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    autoHighlight
                    multiple
                    limitTags={1}
                    value={values.ClubIDs}
                    onChange={(event, newValue) => {
                      setFieldValue('ClubIDs', newValue);
                    }}
                    getOptionLabel={(option) => option.name}
                    options={clubList}
                    renderOption={(props, option) => (
                      <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar alt={option?.name} src={option?.imageURL} sx={{ width: 20, height: 20, marginRight: '5px' }} />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => <TextField {...params} placeholder="Club" InputProps={{
                      ...params.InputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }} />}
                  />
                </Stack>
              </Form>
            </FormikProvider>
          </Stack>
          <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
        </Stack>

        <InfiniteScroll
          next={onScroll}
          hasMore={hasMore}
          loader={SkeletonLoad}
          dataLength={posts.length}
          style={{ overflow: 'inherit' }}
        >
          <Grid container spacing={3}>
            {sortedPosts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </Grid>
        </InfiniteScroll>
      </Container >
    </Page >
  );
}
