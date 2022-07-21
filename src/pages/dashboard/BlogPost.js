import { useEffect, useState } from 'react';
import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
// material
import { Box, Card, Divider, Skeleton, Container, Typography, Pagination, Fade } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getPost } from '../../redux/slices/blog';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Markdown from '../../components/Markdown';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  BlogPostHero,
  BlogPostTags,
  BlogPostRecent,
  BlogPostCommentList,
  BlogPostCommentForm
} from '../../components/_dashboard/blog';
import _ from 'lodash';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    <Skeleton width="100%" height={560} variant="rectangular" sx={{ borderRadius: 2 }} />
    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
      <Skeleton variant="circular" width={64} height={64} />
      <Box sx={{ flexGrow: 1, ml: 2 }}>
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
      </Box>
    </Box>
  </>
);

export default function BlogPost() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { post, error, recentPosts } = useSelector((state) => state.blog);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch]);
  useEffect(() => {
    console.log('check', post);

    const delay = setTimeout(() => {
      console.log('check', post);
      if (!_.isEmpty(post)) {
        // console.log('check', post);
        setLoading((prevLoading) => !prevLoading);
      }

    }, 1000)
    return () => {
      clearTimeout(delay)
    }
  }, [post])
  return (
    <Page title="News: Post Details | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Post Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'News', href: PATH_DASHBOARD.blog.root },
            { name: post?.title }
          ]}
        />

        {post && !loading && (
          <Card>
            <BlogPostHero post={post} />

            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h3" sx={{ mb: 5 }}>
                {post?.title}
              </Typography>

              <Markdown children={post?.content} />

              {(post?.players.length > 0 || post?.clubs.length > 0) && (
                <Box sx={{ mt: 5 }}>
                  <Divider />
                  <BlogPostTags post={post} />
                  {/* <Divider /> */}
                </Box>
              )}

              {/* <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant="h4">Comments</Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                  ({post.comments.length})
                </Typography>
              </Box> */}

              {/* <BlogPostCommentList post={post} /> */}

              {/* <Box sx={{ mb: 5, mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination count={8} color="primary" />
              </Box> */}

              {/* <BlogPostCommentForm /> */}
            </Box>
          </Card>
        )}

        {!post || loading && SkeletonLoad}

        {error && <Typography variant="h6">404 Post not found</Typography>}

        {/* {recentPosts.length > 0 && <BlogPostRecent posts={recentPosts} />} */}
      </Container>
    </Page>
  );
}
