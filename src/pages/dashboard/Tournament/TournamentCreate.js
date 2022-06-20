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
import { getTournamentList } from 'src/redux/slices/tournament';
import TournamentNewForm from 'src/components/_dashboard/tournament/TournamentNewForm';

// ----------------------------------------------------------------------

export default function TournamentCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { tournamentList } = useSelector((state) => state.tournament);
  const isEdit = pathname.includes('edit');
  const currentTournament = tournamentList.find((tournament) => tournament.id === Number(id));

  useEffect(() => {
    dispatch(getTournamentList());
  }, [dispatch]);

  return (
    <Page title="Tournament: Create a new tournament | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new tournament' : 'Edit tournament'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Tournament', href: PATH_DASHBOARD.tournament.root },
            { name: !isEdit ? 'New tournament' : currentTournament?.name }
          ]}
        />

        <TournamentNewForm isEdit={isEdit} currentTournament={currentTournament} />
      </Container>
    </Page>
  );
}
