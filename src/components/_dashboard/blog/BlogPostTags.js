import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import heartFill from '@iconify/icons-eva/heart-fill';
// material
import { Box, Chip, Avatar, AvatarGroup, FormControlLabel, Checkbox } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useNavigate } from 'react-router';

// ----------------------------------------------------------------------

BlogPostTags.propTypes = {
  post: PropTypes.object.isRequired,
  sx: PropTypes.object
};

export default function BlogPostTags({ post, sx }) {
  const { clubs, players } = post;
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 3, ...sx }}>
      {players.map((tag) => (
        <Chip clickable key={tag.id} label={tag.name} sx={{ m: 0.5 }} onClick={() => navigate(`${PATH_DASHBOARD.player.root}/edit/${tag.id}`)} />
      ))}
      {clubs.map((tag) => (
        <Chip clickable key={tag.id} label={tag.name} sx={{ m: 0.5 }} onClick={() => navigate(`${PATH_DASHBOARD.club.root}/edit/${tag.id}`)} />
      ))}

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
        {/* <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              size="small"
              color="error"
              icon={<Icon icon={heartFill} width={20} height={20} />}
              checkedIcon={<Icon icon={heartFill} width={20} height={20} />}
            />
          }
          label={fShortenNumber(favorite)}
        /> */}
        {/* <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
          {favoritePerson.map((person) => (
            <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
          ))}
        </AvatarGroup> */}
      </Box>
    </Box>
  );
}
