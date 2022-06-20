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
import { getRoundList } from 'src/redux/slices/round';
import RoundNewForm from 'src/components/_dashboard/round/RoundNewForm';

// ----------------------------------------------------------------------

export default function RoundCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { roundList } = useSelector((state) => state.round);
  const isEdit = pathname.includes('edit');
  const currentRound = roundList.find((round) => round.id === Number(id));

  useEffect(() => {
    dispatch(getRoundList());
  }, [dispatch]);

  return (
    <Page title="Round: Create a new round | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new round' : 'Edit round'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Round', href: PATH_DASHBOARD.round.root },
            { name: !isEdit ? 'New round' : currentRound?.name }
          ]}
        />

        <RoundNewForm isEdit={isEdit} currentRound={currentRound} />
      </Container>
    </Page>
  );
}
