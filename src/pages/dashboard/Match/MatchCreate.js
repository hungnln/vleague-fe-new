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
import { getMatchList } from 'src/redux/slices/match';
import MatchNewForm from 'src/components/_dashboard/match/MatchNewForm';

// ----------------------------------------------------------------------

export default function MatchCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { matchList } = useSelector((state) => state.match);
  const isEdit = pathname.includes('edit');
  const currentMatch = matchList.find((match) => match.id === Number(id));

  useEffect(() => {
    dispatch(getMatchList());
  }, [dispatch]);

  return (
    <Page title="Match: Create a new match | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new match' : 'Edit match'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Match', href: PATH_DASHBOARD.match.root },
            { name: !isEdit ? 'New match' : currentMatch?.name }
          ]}
        />

        <MatchNewForm isEdit={isEdit} currentMatch={currentMatch} />
      </Container>
    </Page>
  );
}
