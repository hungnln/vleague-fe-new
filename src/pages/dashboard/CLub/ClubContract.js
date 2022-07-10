import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  LinearProgress,
  CircularProgress
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { ClubMoreMenu, ClubListHead, ClubListToolbar } from 'src/components/_dashboard/club/list';
import { getContractList, getClubContracts, getClubDetail, removeClub, getStaffContractList, getPlayerContractList } from 'src/redux/slices/club';
import ClubNewForm from 'src/components/_dashboard/club/ClubNewForm';
import _, { filter } from 'lodash';
import moment from 'moment';
import { fCurrency } from 'src/utils/formatNumber';
import ClubContractMoreMenu from 'src/components/_dashboard/club/contract/ClubContractMoreMenu';
import { removeContract as removePlayerContract } from 'src/redux/slices/player';
import { removeContract as removeStaffContract } from 'src/redux/slices/staff';
// ----------------------------------------------------------------------

export default function ClubConTract() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { playerContractList, staffContractList } = useSelector((state) => state.club);
  const isEdit = _.isNil(id) ? 0 : 1;
  const { clubDetail } = useSelector((state) => state.club)
  const [selected, setSelected] = useState([]);
  // player
  const [filterNamePlayer, setFilterNamePlayer] = useState('');
  const [rowsPerPagePlayer, setRowsPerPagePlayer] = useState(5);
  const [pagePlayer, setPagePlayer] = useState(0);
  const [orderPlayer, setOrderPlayer] = useState('asc');
  const [orderByPlayer, setOrderByPlayer] = useState('name');

  const [filterNameStaff, setFilterNameStaff] = useState('');
  const [rowsPerPageStaff, setRowsPerPageStaff] = useState(5);
  const [pageStaff, setPageStaff] = useState(0);
  const [orderStaff, setOrderStaff] = useState('asc');
  const [orderByStaff, setOrderByStaff] = useState('name');

  useEffect(() => {
    dispatch(getClubDetail(id))
    dispatch(getStaffContractList(id, 'staff'));
    dispatch(getPlayerContractList(id, 'player'));
  }, [dispatch]);
  const handleRequestSortPlayer = (event, property) => {
    const isAsc = orderByPlayer === property && orderPlayer === 'asc';
    setOrderPlayer(isAsc ? 'desc' : 'asc');
    setOrderByPlayer(property);
  };
  const handleRequestSortStaff = (event, property) => {
    const isAsc = orderByStaff === property && orderStaff === 'asc';
    setOrderStaff(isAsc ? 'desc' : 'asc');
    setOrderByStaff(property);
  };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = playerContractList.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };
  const TABLE_HEAD_STAFF_CONTRACT = [
    { id: 'staff', label: 'Staff', alignRight: false },
    { id: 'salary', label: 'Salary', alignRight: false },
    { id: 'start', label: 'Start', alignRight: false },
    { id: 'end', label: 'End', alignRight: false },
    { id: '', label: 'Action', alignRight: true }
  ];
  const TABLE_HEAD_PLAYER_CONTRACT = [
    { id: 'Player', label: 'Player', alignRight: false },
    { id: 'salary', label: 'Salary', alignRight: false },
    { id: 'start', label: 'Start', alignRight: false },
    { id: 'end', label: 'End', alignRight: false },
    { id: '', label: 'Action', alignRight: true }
  ];
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function applySortFilterPlayer(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_contract) => (_contract.player.name.toLowerCase().indexOf(query.toLowerCase()) !== -1));
    }
    return stabilizedThis.map((el) => el[0]);
  }
  function applySortFilterStaff(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_contract) => (_contract.staff.name.toLowerCase().indexOf(query.toLowerCase()) !== -1));
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const emptyRows = pagePlayer > 0 ? Math.max(0, (1 + pagePlayer) * rowsPerPagePlayer - playerContractList.length) : 0;

  const filteredPlayerContract = applySortFilterPlayer(playerContractList, getComparator(orderPlayer, orderByPlayer), filterNamePlayer);
  const filteredStaffContract = applySortFilterStaff(staffContractList, getComparator(orderStaff, orderByStaff), filterNameStaff);

  const isPlayerContractNotFound = filteredPlayerContract.length === 0 && playerContractList.length > 0;
  const isStaffContractNotFound = filteredStaffContract.length === 0 && staffContractList.length > 0;

  const handleChangePagePlayer = (event, newPage) => {
    setPagePlayer(newPage);
  };

  const handleChangeRowsPerPagePlayer = (event) => {
    setRowsPerPagePlayer(parseInt(event.target.value, 10));
    setPagePlayer(0);
  };

  const handleFilterByNamePlayer = (event) => {
    setFilterNamePlayer(event.target.value);
  };
  const handleChangePageStaff = (event, newPage) => {
    setPageStaff(newPage);
  };

  const handleChangeRowsPerPageStaff = (event) => {
    setRowsPerPageStaff(parseInt(event.target.value, 10));
    setPageStaff(0);
  };

  const handleFilterByNameStaff = (event) => {
    setFilterNameStaff(event.target.value);
  };

  const handleDeletePlayerContract = (contractId) => {
    dispatch(removePlayerContract(contractId))

  };
  const handleDeleteStaffContract = (contractId) => {
    dispatch(removeStaffContract(contractId))

  };
  return (
    <Page title="Club: View contract | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {_.isEmpty(clubDetail)?(<Box >
          <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </Box>):(<> <HeaderBreadcrumbs
          heading={`View ${clubDetail?.name} contract`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Club', href: PATH_DASHBOARD.club.root },
            { name: 'Contract', href: `${PATH_DASHBOARD.club.contract}/${id}` },
            { name: clubDetail?.name, href: `${PATH_DASHBOARD.club.root}/edit/${clubDetail?.id}` }
          ]}
          action={
            <>
              <Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.club.contract}/${id}/player/new`}
                startIcon={<Icon icon={plusFill} />}
              >
                New player contract
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.club.contract}/${id}/staff/new`}
                startIcon={<Icon icon={plusFill} />}
                sx={{ ml: 2 }}
              >
                New staff contract
              </Button>
            </>
          }
        />
        <Card>
          <Typography
            sx={{ flex: '1 1 100%', px: 3, pt: 3 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            All of player contracts in {clubDetail.name}
          </Typography>
          <ClubListToolbar numSelected={selected.length} filterName={filterNamePlayer} onFilterName={handleFilterByNamePlayer} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ClubListHead
                  order={orderPlayer}
                  orderBy={orderByPlayer}
                  headLabel={TABLE_HEAD_PLAYER_CONTRACT}
                  rowCount={playerContractList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSortPlayer}
                // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {playerContractList.length <= 0 &&
                    (<TableRow sx={{ width: '100%' }}>
                      <TableCell colSpan={5}> <LinearProgress /></TableCell>
                    </TableRow>)}
                  {filteredPlayerContract.slice(pagePlayer * rowsPerPagePlayer, pagePlayer * rowsPerPagePlayer + rowsPerPagePlayer).map((row) => {
                    const { id, player, salary, start, end, number } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* {isEdit ? '' : <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={club.name} src={club?.imageURL} />
                            <Typography variant="subtitle2" noWrap>
                              {club?.name}
                            </Typography>
                          </Stack>
                        </TableCell>} */}
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */}
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={player} src={player?.imageURL} />
                            <Typography variant="subtitle2">
                              {player?.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{fCurrency(salary)}</TableCell>
                        <TableCell align="left">{moment(start).format('DD-MM-YYYY')}</TableCell>
                        <TableCell align="left">{moment(end).format('DD-MM-YYYY')}</TableCell>

                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(status === 'banned' && 'error') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <ClubContractMoreMenu onDelete={() => handleDeletePlayerContract(id)} contractId={id} clubId={clubDetail.id} type="player" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isPlayerContractNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterNamePlayer} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={playerContractList.length}
            rowsPerPage={rowsPerPagePlayer}
            page={pagePlayer}
            onPageChange={handleChangePagePlayer}
            onRowsPerPageChange={handleChangeRowsPerPagePlayer}
          />
        </Card>
        {/* <ClubContractNewForm isEdit={isEdit} currentContract={currentContract} /> */}
        {/* <ClubNewForm isEdit={isEdit} clubDetail={clubDetail} /> */}

        <Card sx={{ mt: 4 }}>
          <Typography
            sx={{ flex: '1 1 100%', px: 3, pt: 3 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            All of staff contracts in {clubDetail.name}
          </Typography>
          <ClubListToolbar numSelected={selected.length} filterName={filterNameStaff} onFilterName={handleFilterByNameStaff} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ClubListHead
                  order={orderStaff}
                  orderBy={orderByStaff}
                  headLabel={TABLE_HEAD_STAFF_CONTRACT}
                  rowCount={staffContractList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSortStaff}
                // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                {staffContractList.length <= 0 &&
                    (<TableRow sx={{ width: '100%' }}>
                      <TableCell colSpan={5}> <LinearProgress /></TableCell>
                    </TableRow>)}
                  {filteredStaffContract.slice(pageStaff * rowsPerPageStaff, pageStaff * rowsPerPageStaff + rowsPerPageStaff).map((row) => {
                    const { id, staff, salary, start, end } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={staff} src={staff?.imageURL} />
                            <Typography variant="subtitle2" noWrap>
                              {staff?.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{fCurrency(salary)}</TableCell>
                        <TableCell align="left">{moment(start).format('DD-MM-YYYY')}</TableCell>
                        <TableCell align="left">{moment(end).format('DD-MM-YYYY')}</TableCell>

                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(status === 'banned' && 'error') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <ClubContractMoreMenu onDelete={() => handleDeleteStaffContract(id)} contractId={id} type="staff" clubId={clubDetail.id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isStaffContractNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterNameStaff} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={staffContractList.length}
            rowsPerPage={rowsPerPageStaff}
            page={pageStaff}
            onPageChange={handleChangePageStaff}
            onRowsPerPageChange={handleChangeRowsPerPageStaff}
          />
        </Card></>)}
       
      </Container>
    </Page>
  );
}
