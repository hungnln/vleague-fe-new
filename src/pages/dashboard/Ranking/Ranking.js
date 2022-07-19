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
    Grid
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
import { getTournamentRank, getTournamentStanding } from 'src/redux/slices/tournament';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import RedCard from './RedCard';
import YellowCard from './YellowCard';
import GoogleAnalytics from 'src/components/GoogleAnalytics';
import Goal from './Goal';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: '', label: 'Club', alignRight: false },
    { id: '', label: 'Played', alignRight: false },
    { id: '', label: 'Won', alignRight: false },
    { id: '', label: 'Draw', alignRight: false },
    { id: '', label: 'Loss', alignRight: false },
    { id: '', label: 'Goals For', alignRight: false },
    { id: '', label: 'Goals Against', alignRight: false },
    { id: '', label: 'Goal Difference', alignRight: false },
    { id: '', label: 'points', alignRight: false },
    { id: '', label: 'manner', alignRight: false },
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

export default function Ranking({ tournamentID }) {
    const { themeStretch } = useSettings();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { ranks } = useSelector((state) => state.tournament);
    const { Goals, RedCards, YellowCards } = ranks

    useEffect(() => {
        dispatch(getTournamentRank(tournamentID));
    }, [dispatch]);
    console.log(ranks?.Goals, 'checkGoal');
    return (
        <Grid container spacing={3}>
            {Goals.length > 0 && (
                <Grid item xs={4} >
                    <Goal list={Goals} />
                </Grid>
            )}
            {RedCards.length > 0 && (
                <Grid item xs={4} >
                    <RedCard list={RedCards} />
                </Grid>
            )}

            {YellowCards.length > 0 && (
                <Grid item xs={4} >
                    <YellowCard list={YellowCards} />
                </Grid>
            )}
        </Grid >
    );
}
