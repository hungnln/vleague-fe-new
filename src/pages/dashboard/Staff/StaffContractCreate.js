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
import { getContract } from 'src/redux/slices/staff';
import StaffContractNewForm from 'src/components/_dashboard/staff/StaffContractNewForm';
import _ from 'lodash';

// ----------------------------------------------------------------------

export default function StaffContractCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { currentContract } = useSelector((state) => state.staff);
  const isEdit = pathname.includes('edit');
  // const currentContract = contractList.find((contract) => contract.id === Number(id));

  useEffect(() => {
    if (_.isNil(id)) {
      console.log(1);
    } else {
      dispatch(getContract(id, 'staff, club'));
    }
  }, [dispatch]);

  return (
    <Page title="Staff: Create a new contract | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new contract' : 'Edit contract'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contract', href: PATH_DASHBOARD.staff.contract },
            { name: !isEdit ? 'New contract' : `Edit ${currentContract.staff?.name} contract` }
          ]}
        />

        <StaffContractNewForm isEdit={isEdit} currentContract={isEdit ? currentContract : {}} />
        {/* <StaffNewForm isEdit={isEdit} currentStaff={currentStaff} /> */}

      </Container>
    </Page>
  );
}
