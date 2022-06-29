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
    Box
} from '@mui/material';
// redux
// routes
// hooks
// components
import { ModeComment } from '@mui/icons-material';
import moment from 'moment';
import PlayerNewForm from 'src/components/_dashboard/player/PlayerNewForm';
import { DialogAnimate } from 'src/components/animate';
import { format } from 'date-fns';
import useSettings from 'src/hooks/useSettings';
import Scrollbar from 'src/components/Scrollbar';
import { PlayerListHead } from '../../player/list';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'number', label: 'Number', alignRight: false },
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
        return filter(array, (_player) => _player.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function PlayerLineUpList({ heading, playerList }) {
    const { themeStretch } = useSettings();
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('startDate');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPlayer, setCurrentPlayer] = useState({})
    //   useEffect(() => {
    //     // dispatch(getTournamentDetail(id))
    //     dispatch(getPlayerList(tournamentDetail.id));
    //     dispatch(getClubList())
    //     dispatch(getStadiumList())

    //   }, [dispatch]);
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = playerList.map((n) => n.name);
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

    // const handleDeletePlayer = (playerId) => {
    //     // dispatch(deletePlayer(playerId));
    //     dispatch(removePlayer(playerId))

    // };
    // const handleEditPlayer = (player) => {
    //     setCurrentPlayer(player);
    //     dispatch(openModal());
    // }
    // const handleAddPlayer = () => {
    //     setCurrentPlayer({});
    //     dispatch(openModal());
    // };

    // const handleCloseModal = () => {
    //     dispatch(closeModal());
    // };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - playerList.length) : 0;

    const filteredPlayers = applySortFilter(playerList, getComparator(order, orderBy), filterName);

    const isPlayerNotFound = filteredPlayers.length === 0;

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
                        {heading}
                    </Typography>
                    <Box sx={{ flexShrink: 0, mr: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<Icon icon={plusFill} />}
                        // onClick={handleAddPlayer}
                        >
                            New Player
                        </Button>
                    </Box>
                </Stack>
                {/* <PlayerListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

                <Scrollbar>
                    <TableContainer>
                        <Table>
                            <PlayerListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={playerList.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredPlayers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, player } = row;
                                    // const isItemSelected = selected.indexOf(name) !== -1;


                                    return (
                                        <TableRow
                                            hover
                                            key={id}
                                            tabIndex={-1}
                                            role="checkbox"
                                        >
                                            <TableCell component="th" scope="row" padding="none">
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {player?.name}
                                                    </Typography>
                                                    <Avatar alt={player} src={player?.imageURL} />
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                {player?.number}
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
                                                0
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
                                            {/* <SearchNotFound searchQuery={filterName} /> */}
                                            <Paper >
                                                <Typography gutterBottom align="center" variant="subtitle1">
                                                    Not found any playeres
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
                    count={playerList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>

            {/* <DialogAnimate {..._.isEmpty(currentPlayer) ? {} : { width: 'xl' }} open={isOpenModal} onClose={handleCloseModal}>
                <DialogTitle>{_.isEmpty(currentPlayer) ? 'New player' : 'Edit player'}</DialogTitle>

                <PlayerNewForm onCancel={handleCloseModal} tournamentID={id} currentPlayer={currentPlayer} roundSelected={roundSelected} />
            </DialogAnimate> */}


        </>
    )
}
