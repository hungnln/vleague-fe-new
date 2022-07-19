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
    Box
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
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: '', label: 'player', alignRight: false },
    { id: '', label: 'count', alignRight: false },

    // { id: 'mp', label: 'mp', alignRight: false },

    // { id: 'role', label: 'Role', alignRight: false },
    // { id: 'isVerified', label: 'Verified', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
    // { id: '', label: 'Action', alignRight: true }
];

// ----------------------------------------------------------------------
const iconList = {
    "NOT_PLAYED": <RemoveCircleOutlineOutlinedIcon color="disabled" />,
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

export default function RedCard({ list }) {
    const { themeStretch } = useSettings();
    const theme = useTheme();
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = list.map((n) => n.name);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

    const filteredStandings = applySortFilter(list, getComparator(order, orderBy), filterName);

    const isRefereeNotFound = filteredStandings.length === 0 && list.length > 0;

    return (
        <Card>
            <Stack direction='row' alignItems='center' justifyContent='space-between' >
                <Typography
                    sx={{ flex: '1 1 100%', px: 3, pt: 3, mb: 3 }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Top player redcard
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
                            rowCount={list.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                        /> */}
                        <TableBody>
                            {/* {refereeList.length <= 0 &&
                                (<TableRow sx={{ width: '100%' }}>
                                    <TableCell colSpan={4}> <LinearProgress /></TableCell>
                                </TableRow>)} */}
                            {filteredStandings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                const { player, count } = row;
                                // const isItemSelected = selected.indexOf(name) !== -1;

                                return (
                                    <TableRow
                                        hover
                                        key={player.id}
                                        tabIndex={-1}
                                        role="checkbox"
                                    // selected={isItemSelected}
                                    // aria-checked={isItemSelected}
                                    >
                                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */}
                                        <TableCell component="th" scope="row" padding="none">
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar alt={player.name} src={player.imageURL} />
                                                <Typography variant="subtitle2" noWrap>
                                                    {player.name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="left">{count}</TableCell>
                                        {/* <TableCell align="left">{w}</TableCell>
                                        <TableCell align="left">{d}</TableCell>
                                        <TableCell align="left">{l}</TableCell>
                                        <TableCell align="left">{gf}</TableCell>
                                        <TableCell align="left">{ga}</TableCell>
                                        <TableCell align="left">{gd}</TableCell>
                                        <TableCell align="left">{pts}</TableCell> */}
                                        {/* <TableCell align="left">
                                            {last5.map((match, index) => { return iconList[match] })}
                                        </TableCell> */}


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
                count={list.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Card>

    );
}
