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
import { getContract } from 'src/redux/slices/player';
import PlayerContractNewForm from 'src/components/_dashboard/player/PlayerContractNewForm';
import _ from 'lodash';

// ----------------------------------------------------------------------

export default function PlayerContractCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { currentContract } = useSelector((state) => state.player);
  const isEdit = pathname.includes('edit');
  // const currentContract = contractList.find((contract) => contract.id === Number(id));

  useEffect(() => {
    if (_.isNil(id)) {
      console.log(1);
    } else {
      dispatch(getContract(id, 'player, club'));
    }
  }, [dispatch]);

  return (
    <Page title="Player: Create a new contract | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new contract' : 'Edit contract'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contract', href: PATH_DASHBOARD.player.contract },
            { name: !isEdit ? 'New contract' : `Edit ${currentContract.player?.name} contract` }
          ]}
        />

        <PlayerContractNewForm isEdit={isEdit} currentContract={isEdit ? currentContract : {}} />
        {/* <PlayerNewForm isEdit={isEdit} currentPlayer={currentPlayer} /> */}

      </Container>
    </Page>
  );
}
