import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Box, CircularProgress, Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { getPlayerDetail, getPlayerList } from 'src/redux/slices/player';
import PlayerNewForm from 'src/components/_dashboard/player/PlayerNewForm';

// ----------------------------------------------------------------------

export default function PlayerCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { playerDetail } = useSelector((state) => state.player);
  const isEdit = pathname.includes('edit');
  // const currentPlayer = playerList.find((player) => player.id === Number(id));

  useEffect(() => {
    if(id){
      dispatch(getPlayerDetail(id));
    }
  }, [dispatch,id]);

  return (
    <Page title="Player: Create a new player | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {isEdit && playerDetail == null ?
          (<Box>
            <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </Box>)
          :
          (<>
            <HeaderBreadcrumbs
              heading={!isEdit ? 'Create a new player' : 'Edit player'}
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Player', href: PATH_DASHBOARD.player.root },
                { name: !isEdit ? 'New player' : playerDetail?.name }
              ]}
            />

            <PlayerNewForm isEdit={isEdit} currentPlayer={isEdit ? playerDetail : {}} />
          </>)}

      </Container>
    </Page>
  );
}
