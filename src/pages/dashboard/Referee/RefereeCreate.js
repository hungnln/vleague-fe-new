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
import { getRefereeList } from 'src/redux/slices/referee';
import RefereeNewForm from 'src/components/_dashboard/referee/RefereeNewForm';

// ----------------------------------------------------------------------

export default function RefereeCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { refereeList } = useSelector((state) => state.referee);
  const isEdit = pathname.includes('edit');
  const currentReferee = refereeList.find((referee) => referee.id === Number(id));

  useEffect(() => {
    dispatch(getRefereeList());
  }, [dispatch]);

  return (
    <Page title="Referee: Create a new referee | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new referee' : 'Edit referee'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Referee', href: PATH_DASHBOARD.referee.root },
            { name: !isEdit ? 'New referee' : currentReferee?.name }
          ]}
        />

        <RefereeNewForm isEdit={isEdit} currentReferee={isEdit ? currentReferee : {}} />
      </Container>
    </Page>
  );
}
