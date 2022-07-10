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
import { getStadiumList } from 'src/redux/slices/stadium';
import StadiumNewForm from 'src/components/_dashboard/stadium/StadiumNewForm';

// ----------------------------------------------------------------------

export default function StadiumCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { stadiumList } = useSelector((state) => state.stadium);
  const isEdit = pathname.includes('edit');
  const currentStadium = stadiumList.find((stadium) => stadium.id === Number(id));

  useEffect(() => {
    dispatch(getStadiumList());
  }, [dispatch]);

  return (
    <Page title="Stadium: Create a new stadium | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {isEdit && currentStadium == null ?
          (<Box >
            <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </Box>) : (<>
            <HeaderBreadcrumbs
              heading={!isEdit ? 'Create a new stadium' : 'Edit stadium'}
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Stadium', href: PATH_DASHBOARD.stadium.root },
                { name: !isEdit ? 'New stadium' : currentStadium?.name }
              ]}
            />

            <StadiumNewForm isEdit={isEdit} currentStadium={currentStadium} /></>)}

      </Container>
    </Page >
  );
}
