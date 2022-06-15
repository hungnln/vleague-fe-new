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
  TablePagination
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
import { PlayerMoreMenu, PlayerListHead, PlayerListToolbar } from 'src/components/_dashboard/player/list';
import { getContractList, getPlayerContracts, getPlayerDetail, removeContract, removePlayer } from 'src/redux/slices/player';
import PlayerNewForm from 'src/components/_dashboard/player/PlayerNewForm';
import _, { filter } from 'lodash';
import moment from 'moment';
import { fCurrency } from 'src/utils/formatNumber';
import PlayerContractMoreMenu from 'src/components/_dashboard/player/contract/PlayerContractMoreMenu';
import PlayerContractNewForm from 'src/components/_dashboard/player/PlayerContractNewForm';
// ----------------------------------------------------------------------

export default function PlayerConTract() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  // const { playerContracts } = useSelector((state) => state.player);
  const { contractList } = useSelector((state) => state.player);

  const isEdit = _.isNil(id) ? 0 : 1;
  const { playerDetail } = useSelector((state) => state.player)
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const contractList = !_.isNil(playerContracts) ? [playerContracts] : [contractList]
  useEffect(() => {
    if (isEdit) {
      dispatch(getPlayerDetail(id))
      dispatch(getContractList(id, 'player, club'));
    }
    else {
      dispatch(getContractList('', 'player, club'))
    }

  }, [dispatch]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = contractList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const TABLE_HEAD = [
    { id: 'player', label: 'Player', alignRight: false },
    { id: 'club', label: 'Club', alignRight: false },
    { id: 'salary', label: 'Salary', alignRight: false },
    { id: 'start', label: 'Start', alignRight: false },
    { id: 'end', label: 'End', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
    { id: '', label: 'Action', alignRight: true }
  ];
  const TABLE_HEAD_EDIT = [
    { id: 'club', label: 'Club', alignRight: false },
    { id: 'salary', label: 'Salary', alignRight: false },
    { id: 'start', label: 'Start', alignRight: false },
    { id: 'end', label: 'End', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
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

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_contract) => _.includes(_contract, query.toLowerCase));
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contractList.length) : 0;

  const filteredPlayers = applySortFilter(contractList, getComparator(order, orderBy), filterName);

  const isPlayerNotFound = filteredPlayers.length === 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleDeletePlayer = (playerId) => {
    // dispatch(deletePlayer(playerId));
    dispatch(removePlayer(playerId))

  };
  const handleDeleteContract = (playerId) => {
    // dispatch(deletePlayer(playerId));
    dispatch(removeContract(playerId))

  };
  return (
    <Page title="Player: View contract | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'View player contract' : `View ${playerDetail?.name} contract`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Player', href: PATH_DASHBOARD.player.root },
            { name: !isEdit ? 'View all contracts' : playerDetail?.name, href: `${PATH_DASHBOARD.player.root}/edit/${playerDetail?.id}` }
          ]}
          action={
            <>
              <Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.player.list}`}
                startIcon={<Icon icon={plusFill} />}
              >
                View players
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to={`${PATH_DASHBOARD.player.contract}/new`}
                startIcon={<Icon icon={plusFill} />}
                sx={{ ml: 2 }}
              >
                New contract
              </Button>
            </>
          }
        />
        <Card>
          <PlayerListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <PlayerListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={isEdit ? TABLE_HEAD_EDIT : TABLE_HEAD}
                  rowCount={contractList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredPlayers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, player, club, salary, start, end } = row;
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
                        {isEdit ? '' : <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={player.name} src={player?.imageURL} />
                            <Typography variant="subtitle2" noWrap>
                              {player?.name}
                            </Typography>
                          </Stack>
                        </TableCell>}
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */}
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={club} src={club?.imageURL} />
                            <Typography variant="subtitle2" noWrap>
                              {club?.name}
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
                          <PlayerContractMoreMenu onDelete={() => handleDeleteContract(id)} contractId={id} />
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
                {isPlayerNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
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
            count={contractList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        {/* <PlayerContractNewForm isEdit={isEdit} currentContract={currentContract} /> */}
        {/* <PlayerNewForm isEdit={isEdit} playerDetail={playerDetail} /> */}

      </Container>
    </Page>
  );
}
