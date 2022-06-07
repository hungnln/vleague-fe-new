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
import { getStaffList } from 'src/redux/slices/staff';
import StaffNewForm from 'src/components/_dashboard/staff/StaffNewForm';

// ----------------------------------------------------------------------

export default function StaffCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { staffList } = useSelector((state) => state.staff);
  const isEdit = pathname.includes('edit');
  const currentStaff = staffList.find((staff) => staff.id === Number(id));

  useEffect(() => {
    dispatch(getStaffList());
  }, [dispatch]);

  return (
    <Page title="Staff: Create a new staff | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new staff' : 'Edit staff'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Staff', href: PATH_DASHBOARD.staff.root },
            { name: !isEdit ? 'New staff' : currentStaff?.name }
          ]}
        />

        <StaffNewForm isEdit={isEdit} currentStaff={currentStaff} />
        {/* <StaffNewForm isEdit={isEdit} currentStaff={currentStaff} /> */}

      </Container>
    </Page>
  );
}
