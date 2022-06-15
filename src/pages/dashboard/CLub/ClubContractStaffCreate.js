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
import { getClubDetail } from 'src/redux/slices/club';
import _ from 'lodash';

import { getContract } from 'src/redux/slices/staff';
import ClubContractStaffNewForm from 'src/components/_dashboard/club/ClubContractStaffNewForm';

// ----------------------------------------------------------------------

export default function ClubContractStaffCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id, clubId } = useParams();
  const { currentContract } = useSelector((state) => state.staff);
  const { clubDetail } = useSelector((state) => state.club);

  const isEdit = pathname.includes('edit');
  // const currentContract = contractList.find((contract) => contract.id === Number(id));

  useEffect(() => {
    console.log('cluvid',clubId);
    dispatch(getClubDetail(clubId))
    if (_.isNil(id)) {
      console.log(1);
    } else {
      dispatch(getContract(id, 'staff'));
    }
  }, [dispatch]);

  return (
    <Page title="Club: Create a new contract | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new staff contract' : 'Edit staff contract'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contract', href: PATH_DASHBOARD.club.contract },
            { name: !isEdit ? `New ${clubDetail.name} contract` : `Edit ${clubDetail.name} contract` }
          ]}
        />

        <ClubContractStaffNewForm isEdit={isEdit} currentClub={clubDetail} currentContract={isEdit ? currentContract : {}} />
        {/* <ClubNewForm isEdit={isEdit} currentClub={currentClub} /> */}

      </Container>
    </Page>
  );
}
