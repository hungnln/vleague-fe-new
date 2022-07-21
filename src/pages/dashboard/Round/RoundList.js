import _, { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useParams } from 'react-router-dom';
// material
import { useTheme } from '@mui/material/styles';
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
  DialogTitle,
  Grid,
  LinearProgress,
  Box,
  CircularProgress
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { closeModal, getRoundList, openModal, removeRound } from '../../../redux/slices/round';
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
import { ModeComment } from '@mui/icons-material';
import moment from 'moment';
import { RoundListHead, RoundListToolbar, RoundMoreMenu } from 'src/components/_dashboard/round/list';
import RoundNewForm from 'src/components/_dashboard/round/RoundNewForm';
import { DialogAnimate } from 'src/components/animate';
import { getTournamentDetail, getTournamentList } from 'src/redux/slices/tournament';
import MatchList from '../Match/MatchList';
import Standing from '../Standing/Standing';
import Ranking from '../Ranking/Ranking';
import LoadingProgress from 'src/pages/LoadingProgress';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: '', label: 'Action', alignRight: true }
];

// ----------------------------------------------------------------------

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
    return filter(array, (_round) => _round.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function RoundList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { roundList, isOpenModal } = useSelector((state) => state.round);
  const { tournamentDetail } = useSelector(state => state.tournament)
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentRound, setCurrentRound] = useState({})
  const [roundSelected, setRoundSelected] = useState(null)
  const [rankModal, setRankModal] = useState(false)
  const { id } = useParams()
  useEffect(() => {
    dispatch(getTournamentDetail(id))
    dispatch(getRoundList(id));
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = roundList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

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

  const handleDeleteRound = (roundId) => {
    // dispatch(deleteRound(roundId));
    dispatch(removeRound(roundId))

  };
  const handleEditRound = (round) => {
    setCurrentRound(round);
    dispatch(openModal());
  }
  const handleAddRound = () => {
    setCurrentRound({});
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };
  const handleOpenRankModal = () => {
    setRankModal(true)

  }
  const handleCloseRankModal = () => {
    setRankModal(false)
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - roundList.length) : 0;

  const filteredRounds = applySortFilter(roundList, getComparator(order, orderBy), filterName);

  const isRoundNotFound = filteredRounds.length === 0;

  return (
    <Page title="Round: List | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {_.isEmpty(tournamentDetail) ? (<Box >
          <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </Box>) : (<> <HeaderBreadcrumbs
          heading={`All round of ${tournamentDetail.name}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Tournament', href: PATH_DASHBOARD.tournament.root },
            { name: 'List round', href: `${PATH_DASHBOARD.tournament.root}/${id}/round` }
          ]}
          action={
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Button
                variant="contained"
                startIcon={<Icon icon={plusFill} />}
                onClick={handleOpenRankModal}
                sx={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
              >
                View Ranking
              </Button>
              <Button
                variant="contained"
                startIcon={<Icon icon={plusFill} />}
                onClick={handleAddRound}
                sx={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
              >
                New Round
              </Button>
            </Stack>
          }
        />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <RoundListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                <Scrollbar>
                  <TableContainer sx={{ minWidth: 300 }}>
                    <Table>
                      <RoundListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={roundList.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                      />
                      <TableBody>
                        {roundList.length <= 0 &&
                          <LoadingProgress />}
                        {filteredRounds.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                          const { id, name, tournamentID } = row;
                          const isItemSelected = selected.indexOf(name) !== -1;

                          return (
                            <TableRow
                              hover
                              key={id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                            // onClick={() => setRoundSelected(row)}
                            >
                              {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */}
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  {/* <Avatar alt={name} src={imageURL} /> */}
                                  <Typography variant="subtitle2" noWrap>
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>

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
                                <RoundMoreMenu onDelete={() => handleDeleteRound(id)} onEdit={() => { handleEditRound(row) }} roundName={name} roundId={id} />
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
                      {isRoundNotFound && (
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
                  count={roundList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={8}><MatchList roundSelected={roundSelected} /></Grid>
            {/* <Grid item xs={12} md={12}><Standing tournamentID={tournamentDetail.id} /></Grid>
            <Grid item xs={12} md={12}><Ranking tournamentID={tournamentDetail.id} /></Grid> */}

          </Grid>
          <DialogAnimate width='lg' open={rankModal} onClose={handleCloseRankModal} scroll='body'>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}><Standing tournamentID={tournamentDetail.id} /></Grid>
                <Grid item xs={12} md={12}><Ranking tournamentID={tournamentDetail.id} /></Grid>
              </Grid>
            </Stack>
          </DialogAnimate>
          <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
            <DialogTitle>{_.isEmpty(currentRound) ? 'New round' : 'Edit round'}</DialogTitle>

            <RoundNewForm onCancel={handleCloseModal} tournamentID={tournamentDetail.id} currentRound={currentRound} />
          </DialogAnimate></>)}

      </Container>
    </Page >
  );
}
