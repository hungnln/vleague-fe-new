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
  Paper,
  Box,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { closeModal, getMatchList, openModal, removeMatch } from '../../../redux/slices/match';
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
import { MatchListHead, MatchListToolbar, MatchMoreMenu } from 'src/components/_dashboard/match/list';
import MatchNewForm from 'src/components/_dashboard/match/MatchNewForm';
import { DialogAnimate } from 'src/components/animate';
import { getTournamentDetail, getTournamentList } from 'src/redux/slices/tournament';
import { getClubList } from 'src/redux/slices/club';
import { format } from 'date-fns';
import { getStadiumList } from 'src/redux/slices/stadium';
import match from 'autosuggest-highlight/match';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Home', label: 'Home', alignRight: false },
  { id: 'startDate', label: 'Score', alignRight: false },
  { id: 'Away', label: 'Away', alignRight: false },

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
    return filter(array, (_match) => _match.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function MatchList({ roundSelected }) {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { matchList, isOpenModal } = useSelector((state) => state.match);
  const { roundList } = useSelector((state) => state.round);
  const { clubList } = useSelector((state) => state.club);
  const { stadiumList } = useSelector((state) => state.stadium);
  const [selectedRound, setSelectedRound] = useState('')
  const [selectedStadium, setSelectedStadium] = useState('')

  const { tournamentDetail } = useSelector(state => state.tournament)
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('startDate');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentMatch, setCurrentMatch] = useState({})
  const { id } = useParams()
  useEffect(() => {
    // dispatch(getTournamentDetail(id))
    dispatch(getMatchList(tournamentDetail.id));
    dispatch(getClubList())
    dispatch(getStadiumList())

  }, [dispatch]);

  useEffect(() => {
    console.log(selectedStadium, "check");
    dispatch(getMatchList(tournamentDetail.id, selectedRound, selectedStadium));
  }, [selectedRound, selectedStadium])
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = matchList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleChangeRound = (event) => {
    setSelectedRound(event.target.value);
  };
  const handleChangeStadium = (event) => {
    setSelectedStadium(event.target.value);
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

  const handleDeleteMatch = (matchId) => {
    // dispatch(deleteMatch(matchId));
    dispatch(removeMatch(matchId))

  };
  const handleEditMatch = (match) => {
    setCurrentMatch(match);
    dispatch(openModal());
  }
  const handleAddMatch = () => {
    setCurrentMatch({});
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - matchList.length) : 0;

  const filteredMatchs = applySortFilter(matchList, getComparator(order, orderBy), filterName);

  const isMatchNotFound = filteredMatchs.length === 0 && matchList.length > 0;

  return (
    <>
      <Card>
        <Stack direction='row' alignItems='center' justifyContent='space-between' >
          <Typography
            sx={{ flex: '1 1 100%', px: 3, pt: 3, mb: 3 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            All matches {roundSelected ? `of ${roundSelected.name}` : ''}
          </Typography>
          <Box sx={{ flexShrink: 0, mr: 3 }}>
            <Button
              variant="contained"
              startIcon={<Icon icon={plusFill} />}
              onClick={handleAddMatch}
            >
              New Match
            </Button>
          </Box>
        </Stack>
        <Stack direction='row' alignItems='center' justifyContent='flex-start' sx={{ px: 3, mb: 3 }} spacing={2}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-filled-label">Round</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={selectedRound}
              label="Round"
              onChange={handleChangeRound}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {roundList.map((round, index) => {
                return <MenuItem value={round.id}>{round.name}</MenuItem>

              })}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-filled-label">Stadium</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={selectedStadium}
              label="Round"
              onChange={handleChangeStadium}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {stadiumList.map((stadium, index) => {
                return <MenuItem value={stadium.id}>{stadium.name}</MenuItem>

              })}
            </Select>
          </FormControl>
        </Stack>
        {/* <MatchListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

        <Scrollbar>
          <TableContainer sx={{ ma: 800 }}>
            <Table>
              <MatchListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={matchList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {matchList.length <= 0 &&
                  (<TableRow sx={{ width: '100%' }}>
                    <TableCell colSpan={5}> <LinearProgress /></TableCell>
                  </TableRow>)}
                {filteredMatchs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { id, homeClubID, awayClubID, startDate, roundID, stadiumID, homeGoals, awayGoals } = row;
                  const homeClub = clubList.find(club => club.id === homeClubID)
                  const awayClub = clubList.find(club => club.id === awayClubID)
                  const round = roundList.find(round => round.id === roundID);
                  const stadium = stadiumList.find(stadium => stadium.id === stadiumID);
                  const rowEdit = { ...row, homeClub, awayClub, round, stadium }
                  // const isItemSelected = selected.indexOf(name) !== -1;


                  return (
                    <TableRow
                      hover
                      key={id}
                      tabIndex={-1}
                      role="checkbox"
                    >
                      <TableCell component="th" scope="row" padding="none" >
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {homeClub?.name}
                          </Typography>
                          <Avatar alt={homeClub} src={homeClub?.imageURL} />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {round?.name}
                        </Typography>
                        {new Date(startDate) > new Date() ?
                          <><Typography variant="subtitle2">{format(new Date(startDate), 'dd MMM yyyy')}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {format(new Date(startDate), 'p')}
                            </Typography></>
                          : `${homeGoals} - ${awayGoals}`}

                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                          <Avatar alt={awayClub} src={awayClub?.imageURL} />
                          <Typography variant="subtitle2" noWrap>
                            {awayClub?.name}
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
                        <MatchMoreMenu onDelete={() => handleDeleteMatch(id)} onEdit={() => { handleEditMatch(rowEdit) }} matchId={id} />
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
              {isMatchNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      {/* <SearchNotFound searchQuery={filterName} /> */}
                      <Paper >
                        <Typography gutterBottom align="center" variant="subtitle1">
                          Not found any matches
                        </Typography>
                      </Paper>
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
          count={matchList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <DialogAnimate {..._.isEmpty(currentMatch) ? {} : { width: 'xl' }} open={isOpenModal} onClose={handleCloseModal}>
        <DialogTitle>{_.isEmpty(currentMatch) ? 'New match' : 'Edit match'}</DialogTitle>

        <MatchNewForm onCancel={handleCloseModal} tournamentID={id} currentMatch={currentMatch} roundSelected={roundSelected} />
      </DialogAnimate>


    </>
  )
}
