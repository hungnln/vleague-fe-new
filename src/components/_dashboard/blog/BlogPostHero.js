import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import shareFill from '@iconify/icons-eva/share-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Avatar, SpeedDial, Typography, SpeedDialAction, useMediaQuery } from '@mui/material';
// utils
import { fDate, fDateTime } from '../../../utils/formatTime';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useDispatch } from 'react-redux';
import { deletePost } from 'src/redux/slices/blog';
import { useNavigate } from 'react-router';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import useAuth from 'src/hooks/useAuth';




// ----------------------------------------------------------------------



const RootStyle = styled('div')(({ theme }) => ({
  height: 480,
  position: 'relative',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  [theme.breakpoints.up('md')]: {
    height: 'auto',
    paddingTop: 'calc(100% * 9 / 16)'
  },
  '&:before': {
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: alpha(theme.palette.grey[900], 0.72)
  }
}));

const TitleStyle = styled(Typography)(({ theme }) => ({
  top: 0,
  zIndex: 10,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(10)
  }
}));

const FooterStyle = styled('div')(({ theme }) => ({
  bottom: 0,
  zIndex: 10,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'flex-end',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('sm')]: {
    alignItems: 'center',
    paddingRight: theme.spacing(3)
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(10)
  }
}));

const CoverImgStyle = styled('img')({
  top: 0,
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

BlogPostHero.propTypes = {
  post: PropTypes.object.isRequired
};

export default function BlogPostHero({ post, ...other }) {
  const { thumbnailImageURL, title, createdAt } = post;
  const theme = useTheme();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { user } = useAuth()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleDeletePost = () => {
    dispatch(deletePost(post.id))
    navigate(PATH_DASHBOARD.blog.root)
  }
  const SOCIALS = [
    {
      name: 'Edit',
      icon: <Icon icon={editFill} width={20} height={20} color="#1877F2" />,
      link: `${PATH_DASHBOARD.blog.root}/edit/${post.id}`
    },
    {
      name: 'Delete',
      icon: <Icon icon={trash2Outline} width={20} height={20} color="#D7336D" />
    },
    // {
    //   name: 'Linkedin',
    //   icon: <Icon icon={linkedinFill} width={20} height={20} color="#006097" />
    // },
    // {
    //   name: 'Twitter',
    //   icon: <Icon icon={twitterFill} width={20} height={20} color="#1C9CEA" />
    // }
  ];
  return (
    <RootStyle {...other}>
      <CoverImgStyle alt="post cover" src={thumbnailImageURL} />

      <TitleStyle variant="h2" component="h1">
        {title}
      </TitleStyle>

      <FooterStyle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Avatar alt={author.name} src={author.imageURL} sx={{ width: 48, height: 48 }} /> */}
          <Box sx={{ ml: 2 }}>
            {/* <Typography variant="subtitle1" sx={{ color: 'common.white' }}>
              {author.name}
            </Typography> */}
            <Typography variant="body2" sx={{ color: 'grey.500' }}>
              {fDateTime(createdAt)}
            </Typography>
          </Box>
        </Box>

        {user.Role === 'Admin' && (<SpeedDial
          direction={isMobile ? 'up' : 'left'}
          ariaLabel="Share post"
          icon={<Icon icon={moreVerticalFill} />}
          sx={{ '& .MuiSpeedDial-fab': { width: 48, height: 48 } }}
        >
          {SOCIALS.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipPlacement="top"
              FabProps={{ color: 'default' }}
              onClick={() => action.link ? navigate(action.link) : handleDeletePost()}
            />
          ))}
        </SpeedDial>)}
      </FooterStyle>
    </RootStyle>
  );
}
