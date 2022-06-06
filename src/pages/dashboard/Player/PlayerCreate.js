import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { getPlayerList } from 'src/redux/slices/player';
import PlayerNewForm from 'src/components/_dashboard/player/PlayerNewForm';

// ----------------------------------------------------------------------

export default function PlayerCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { playerList } = useSelector((state) => state.player);
  const isEdit = pathname.includes('edit');
  const currentPlayer = playerList.find((player) => player.id === Number(id));

  useEffect(() => {
    dispatch(getPlayerList());
  }, [dispatch]);

  return (
    <Page title="Player: Create a new player | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new player' : 'Edit player'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Player', href: PATH_DASHBOARD.player.root },
            { name: !isEdit ? 'New player' : currentPlayer?.name }
          ]}
        />

        <PlayerNewForm isEdit={isEdit} currentPlayer={currentPlayer} />
      </Container>
    </Page>
  );
}
