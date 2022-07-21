import { filter } from 'lodash';
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
    LinearProgress,
    Box,
    TableHead
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getRefereeList, deleteReferee, removeReferee } from '../../../redux/slices/referee';
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
// import { UserListHead, UserListToolbar, UserMoreMenu } from '../../components/_dashboard/user/list';
import { RefereeMoreMenu, RefereeListHead, RefereeListToolbar } from 'src/components/_dashboard/referee/list';
import { getTournamentStanding } from 'src/redux/slices/tournament';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LoadingProgress from 'src/pages/LoadingProgress';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: '', label: '', alignRight: false },
    { id: '', label: 'Club', alignRight: false },
    { id: '', label: 'Played', alignRight: false },
    { id: '', label: 'Won', alignRight: false },
    { id: '', label: 'Draw', alignRight: false },
    { id: '', label: 'Loss', alignRight: false },
    { id: '', label: 'GF', alignRight: false },
    { id: '', label: 'GA', alignRight: false },
    { id: '', label: 'GD', alignRight: false },
    { id: '', label: 'points', alignRight: false },
    { id: '', label: 'manner', alignRight: false },
];

// ----------------------------------------------------------------------
const iconList = {
    "WIN": <CheckCircleOutlinedIcon color="success" />,
    "NOT_PLAYED": <RemoveCircleOutlineOutlinedIcon color="disabled" />,
    "LOSS": <CancelOutlinedIcon color="error" />
}

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
        return filter(array, (_referee) => _referee.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function Standing({ tournamentID }) {
    const { themeStretch } = useSettings();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { standings } = useSelector((state) => state.tournament);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        dispatch(getTournamentStanding(tournamentID));
    }, [dispatch]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = standings.map((n) => n.name);
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

    const handleDeleteReferee = (refereeId) => {
        // dispatch(deleteReferee(refereeId));
        dispatch(removeReferee(refereeId))

    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - standings.length) : 0;

    const filteredStandings = applySortFilter(standings, getComparator(order, orderBy), filterName);

    const isRefereeNotFound = filteredStandings.length === 0 && standings.length > 0;

    return (
        <Card>
            <Stack direction='row' alignItems='center' justifyContent='space-between' >
                <Typography
                    sx={{ flex: '1 1 100%', px: 3, pt: 3, mb: 3 }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Top standings
                </Typography>

            </Stack>
            {/* <RefereeListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
            <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                        {/* <RefereeListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={standings.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                        /> */}
                        <TableHead>
                            <TableRow>
                                <TableCell align='left' colSpan={2}>
                                    Club
                                </TableCell>
                                <TableCell align="left">Played</TableCell>
                                <TableCell align="left">Won</TableCell>
                                <TableCell align="left">Draw</TableCell>
                                <TableCell align="left">Loss</TableCell>
                                <TableCell align="left">GF</TableCell>
                                <TableCell align="left">GA</TableCell>
                                <TableCell align="left">GD</TableCell>
                                <TableCell align="left">Points</TableCell>
                                <TableCell align="left">Manners</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {standings.length <= 0 && <LoadingProgress />}
                            {filteredStandings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                const { club, mp, w, d, l, gf, ga, gd, pts, last5 } = row;
                                // const isItemSelected = selected.indexOf(name) !== -1;

                                return (
                                    <TableRow
                                        hover
                                        key={club.id}
                                        tabIndex={-1}
                                        role="checkbox"
                                    // selected={isItemSelected}
                                    // aria-checked={isItemSelected}
                                    >
                                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */}
                                        <TableCell align="left">{index + 1}</TableCell>
                                        <TableCell component="th" scope="row" padding="none">
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar alt={club.name} src={club.imageURL} />
                                                <Typography variant="subtitle2" noWrap>
                                                    {club.name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="left">{mp}</TableCell>
                                        <TableCell align="left">{w}</TableCell>
                                        <TableCell align="left">{d}</TableCell>
                                        <TableCell align="left">{l}</TableCell>
                                        <TableCell align="left">{gf}</TableCell>
                                        <TableCell align="left">{ga}</TableCell>
                                        <TableCell align="left">{gd}</TableCell>
                                        <TableCell align="left">{pts}</TableCell>
                                        <TableCell align="left">
                                            {last5.map((match, index) => { return iconList[match] })}
                                        </TableCell>


                                        {/* <TableCell align="left">{role}</TableCell> */}
                                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                                        {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(status === 'banned' && 'error') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                                        {/* <TableCell align="right">
                                            <RefereeMoreMenu onDelete={() => handleDeleteReferee(id)} refereeName={name} refereeId={id} />
                                        </TableCell> */}
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        {isRefereeNotFound && (
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
                count={standings.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Card>

    );
}
