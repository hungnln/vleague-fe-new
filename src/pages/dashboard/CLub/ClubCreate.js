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
import { getClubDetail, getClubList } from 'src/redux/slices/club';
import ClubNewForm from 'src/components/_dashboard/club/ClubNewForm';
import { getStadiumList } from 'src/redux/slices/stadium';

// ----------------------------------------------------------------------

export default function ClubCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { clubList, clubDetail } = useSelector((state) => state.club);
  const isEdit = pathname.includes('edit');
  // const currentClub = clubList.find((club) => club.id === Number(id));

  useEffect(() => {
    if (id) {
      dispatch(getClubDetail(id));
    }
    dispatch(getStadiumList(0, 1000))
  }, [dispatch]);

  return (
    <Page title="Club: Create a new club | V League">
      <Container maxWidth={themeStretch ? false : 'lg'} >
        {isEdit && clubDetail == null ? (
          <Box >
            <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </Box>
        ) : (<>
          <HeaderBreadcrumbs
            heading={!isEdit ? 'Create a new club' : 'Edit club'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Club', href: PATH_DASHBOARD.club.root },
              { name: !isEdit ? 'New club' : clubDetail?.name }
            ]}
          />
          <ClubNewForm isEdit={isEdit} currentClub={clubDetail} />
        </>
        )}



      </Container>
    </Page>
  );
}
