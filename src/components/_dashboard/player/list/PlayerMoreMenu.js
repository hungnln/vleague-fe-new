import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { paramCase } from 'change-case';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

PlayerMoreMenu.propTypes = {
  onDelete: PropTypes.func,
  userName: PropTypes.string
};

export default function PlayerMoreMenu({ onDelete, playerName, playerId }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'
  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {isAdmin && (<MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>)}

        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.player.root}/edit/${playerId}`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.player.root}/contract/${playerId}`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <BusinessCenterIcon icon={eyeFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="View contract" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
