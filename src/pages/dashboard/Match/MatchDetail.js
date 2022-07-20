import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useEffect, useState } from 'react';
import heartFill from '@iconify/icons-eva/heart-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import roundPermMedia from '@iconify/icons-ic/round-perm-media';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import baselineOnlinePrediction from '@iconify/icons-ic/baseline-online-prediction';
// material
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container, Stack, Grid, Avatar, Typography, CircularProgress, Badge } from '@mui/material';
// routes
// hooks
// components
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import useAuth from 'src/hooks/useAuth';
import useSettings from 'src/hooks/useSettings';
import { useDispatch, useSelector } from 'react-redux';
import Event from 'src/components/_dashboard/match/detail/Event';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { getMatchDetail, getMatchParticipation, getMatchStatistic } from 'src/redux/slices/match';
import { useParams } from 'react-router';
import Lineup from 'src/components/_dashboard/match/detail/Lineup';
import { format } from 'date-fns';
import moment from 'moment';
import Page from 'src/components/Page';
import { a } from 'react-spring';
import _ from 'lodash';
import { getPlayerList } from 'src/redux/slices/player';
import { getStaffList } from 'src/redux/slices/staff';
import { getRefereeList } from 'src/redux/slices/referee';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Statistic from 'src/components/_dashboard/match/detail/Statistic';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
    zIndex: 9,
    bottom: 0,
    width: '100%',
    display: 'flex',
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('sm')]: {
        justifyContent: 'center'
    },
    [theme.breakpoints.up('md')]: {
        justifyContent: 'center',
        paddingRight: theme.spacing(3)
    }
}));

// ----------------------------------------------------------------------

export default function MatchDetail() {
    const { themeStretch } = useSettings();
    const dispatch = useDispatch();
    const { currentMatch, matchParticiation } = useSelector((state) => state.match);
    const { playerList } = useSelector(state => state.player)
    const { staffList } = useSelector(state => state.staff)
    const { refereeList } = useSelector(state => state.referee)

    const { matchId } = useParams();
    const [currentTab, setCurrentTab] = useState('happening');
    const [findFriends, setFindFriends] = useState('');
    const { homeClub, awayClub, homeGoals, awayGoals, startDate, endDate, activities, round, homeClubID, awayClubID } = currentMatch
    useEffect(() => {
        console.log(1);
        dispatch(getMatchDetail(matchId))
        dispatch(getMatchStatistic(matchId))
        setTimeout(() => {
            console.log(2);
            dispatch(getMatchParticipation(matchId))
        }, 2000);


    }, [dispatch]);
    useEffect(() => {
        const getDetail = setInterval(() => {
            dispatch(getMatchDetail(matchId))
        }, 10000);
        return () => clearTimeout(getDetail);
    }, [])
    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

    if (!currentMatch) {
        return null;
    }
    // setInterval(() => {
    //     console.log("check render");
    //     // dispatch(getMatchDetail(matchId))
    // }, 10000);
    const PROFILE_TABS = [
        {
            value: 'happening',
            icon: <Icon icon={baselineOnlinePrediction} width={20} height={20} />,
            component: <Event activities={activities} />
        },
        {
            value: 'lineup',
            icon: <Icon icon={roundAccountBox} width={20} height={20} />,
            component: <Lineup />
        },
        {
            value: 'statistic',
            icon: <Icon icon={roundAccountBox} width={20} height={20} />,
            component: <Statistic activities={activities} />
        },
        // {
        //     value: 'news',
        //     icon: <Icon icon={roundAccountBox} width={20} height={20} />,
        //     component: <Event activities={activities} />
        // },
    ];

    return (
        <Page title={`Match: ${homeClub?.name} vs ${awayClub?.name} | V League`}>
            <Container maxWidth={themeStretch ? false : 'lg'}>
                {_.isEmpty(currentMatch) ? (<Box >
                    <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                </Box>) : (<> <HeaderBreadcrumbs
                    heading="Match"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Tournament', href: PATH_DASHBOARD.tournament.root },
                        // { name: 'Round', href: `${PATH_DASHBOARD.tournament.root}/${currentMatch?.roundID}/round` },
                        // { name: 'Match', href: PATH_DASHBOARD.match.root },
                        { name: currentMatch?.id }
                    ]}
                />
                    <Card
                        sx={{
                            mb: 3,
                            height: 200,
                            position: 'relative'
                        }}
                    >   <Typography variant="subtitle2" noWrap sx={{ mt: 1, px: 3 }}>
                            {moment(new Date(currentMatch?.startDate)).format('DD MMM yyyy HH:mm')}
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 1, px: 3 }}>
                            <Grid item xs={4}>
                                <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="center">
                                    <Avatar alt={homeClub} src={homeClub?.imageURL} />
                                    <Typography variant="subtitle2" noWrap>
                                        {homeClub?.name}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack spacing={3} direction="row" alignItems="center" justifyContent="center">
                                    <Typography variant="h2" noWrap>
                                        {homeGoals} : {awayGoals}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack spacing={3} direction={{ xs: 'column-reverse', sm: 'row' }} alignItems="center" justifyContent="center">
                                    <Typography variant="subtitle2" noWrap>
                                        {awayClub?.name}
                                    </Typography>
                                    <Avatar alt={awayClub} src={awayClub?.imageURL} />

                                </Stack>
                            </Grid>
                        </Grid>
                        <TabsWrapperStyle>
                            <Tabs
                                value={currentTab}
                                scrollButtons="auto"
                                variant="scrollable"
                                allowScrollButtonsMobile
                                onChange={handleChangeTab}
                            >
                                {PROFILE_TABS.map((tab) => (
                                    <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalCase(tab.value)} />
                                ))}
                            </Tabs>
                        </TabsWrapperStyle>
                    </Card>

                    {PROFILE_TABS.map((tab) => {
                        const isMatched = tab.value === currentTab;
                        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
                    })}</>)}

            </Container>
        </Page>
    );
}
