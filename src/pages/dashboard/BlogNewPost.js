// material
import { Box, CircularProgress, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { BlogNewPostForm } from '../../components/_dashboard/blog';
import { useLocation, useParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPost } from 'src/redux/slices/blog';

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  const { themeStretch } = useSettings();
  const { id } = useParams();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { post } = useSelector((state) => state.blog);

  const isEdit = pathname.includes('edit');
  useEffect(() => {
    if (id) {
      dispatch(getPost(id));
    }
  }, [dispatch]);
  return (
    <Page title="News: New Post | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {isEdit && post == null ? (<Box >
          <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </Box>) : (<><HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new post' : 'Edit post'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'News', href: PATH_DASHBOARD.blog.root },
            { name: !isEdit ? 'New post' : post?.title }
          ]}
        />

          <BlogNewPostForm isEdit={isEdit} currentPost={isEdit ? post : {}} /></>)}

      </Container>
    </Page>
  );
}
