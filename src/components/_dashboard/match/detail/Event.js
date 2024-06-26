import PropTypes from 'prop-types';
// material
import { Avatar, Box, Card, DialogTitle, Grid, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Typography } from '@mui/material';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { useEffect, useState } from 'react';
import { addActivity, closeModal, getMatchDetail, openModal } from 'src/redux/slices/match';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import { DialogAnimate } from 'src/components/animate';
import EventNewForm from '../EventNewForm';
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined';
import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined';
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FlagIcon from '@mui/icons-material/Flag';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import useAuth from 'src/hooks/useAuth';
import { FAILURE, SUCCESS } from 'src/config';


// ----------------------------------------------------------------------

Event.propTypes = {

};

export default function Event() {
    const listIcon = {
        "StartFirstHalf": <PlayCircleFilledWhiteIcon />,
        "Goal": <SportsSoccerIcon />,
        "OwnGoal": <SportsSoccerIcon />,
        "RedCard": <ViewCarouselIcon sx={{ color: 'red' }} />,
        "YellowCard": <ViewCarouselIcon sx={{ color: 'yellow' }} />,
        "Offside": <FlagIcon />,
        "KickOff": <RestartAltIcon />,
        "Penalty": <AspectRatioIcon />,
        "Foul": <ReportProblemIcon />,
        "Header": <LocationSearchingIcon />,
        "Corner": <SportsScoreIcon />,
        "BackHeel": <ReportProblemIcon />,
        "Substitution": <ChangeCircleOutlinedIcon />

    }
    const { user } = useAuth()
    const isAdmin = user?.role === 'Admin'
    const { currentMatch, isOpenModal } = useSelector(state => state.match);
    const { activities, homeClub, awayClub, homeClubId, awayClubId } = currentMatch;
    const [errorState, setErrorState] = useState();
    const [component, setComponent] = useState()
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch()
    const arrExtraTime = _.sortBy(activities?.filter(activity => activity.type === "ExtraTime"), (activity => { return activity.minuteInMatch }))
    const activityFirsthalf = _.sortBy(activities?.filter(activity => activity?.id === arrExtraTime[0]?.id || activity.minuteInMatch < 46), (activity => { return activity.minuteInMatch }))
    const activitySecondhalf = _.sortBy(activities?.filter(activity => !activityFirsthalf.find(element => element.id === activity.id)), (activity => { return activity.minuteInMatch }))
    const matchTime = ["ExtraTime", "EndFirstHalf", "StartFirstHalf", "StartSecondHalf", "EndSecondHalf", "EndMatch"]
    const activitiesConvert = [].concat(activityFirsthalf, activitySecondhalf)
    const renderActivityDetail = (activity) => {
        if (matchTime.find(element => element === activity.type)) {
            return <TimelineItem key={activity?.id}>
                {activity.type === "ExtraTime" ?
                    <TimelineOppositeContent>{activity.id === arrExtraTime[0].id ? (`45"+${activity?.minuteInMatch - 45}`) : (`90"+${activity?.minuteInMatch - 90}`)}</TimelineOppositeContent>
                    :
                    <TimelineOppositeContent>{activity.minuteInMatch}"</TimelineOppositeContent>

                }
                <TimelineSeparator>
                    <TimelineDot color="success" />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{activity?.type}</TimelineContent>
            </TimelineItem>
        }
        return activity.playerMatchParticipations[0].playerContract?.club.id === homeClubId ?

            (<TimelineItem TimelineItem key={activity?.id} >
                <TimelineOppositeContent>
                    <Typography variant="h6" component="span">
                        {activity.type}
                    </Typography>
                    <Typography>{activity.playerMatchParticipations.map((contract, index) => { return ` ${contract?.playerContract?.number}-${contract?.playerContract?.player?.name}` })}</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="secondary" >
                        {listIcon[activity.type]}
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    {activity.minuteInMatch}"
                </TimelineContent>
            </TimelineItem>)
            :
            (<TimelineItem TimelineItem key={activity?.id} >
                <TimelineOppositeContent>{activity.minuteInMatch}"</TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="error" >
                        {listIcon[activity.type]}
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Typography variant="h6" component="span">
                        {activity.type}
                    </Typography>
                    <Typography>{activity.playerMatchParticipations.map((contract, index) => { return ` ${contract?.playerContract?.number}-${contract?.playerContract?.player?.name}` })}</Typography>
                </TimelineContent>
            </TimelineItem>)

    }
    const renderActivities = () => {
        return activitiesConvert.map((activity, index) => {
            return renderActivityDetail(activity)
        })
    }
    const handleCloseModal = () => {
        dispatch(closeModal());
    };

    const actions = [
        { icon: <LooksOneOutlinedIcon />, name: 'Set 1st half', values: [{ matchId: currentMatch.id, type: 0, minuteInMatch: 0 }, { matchId: currentMatch.id, type: 13, minuteInMatch: 45 }] },
        { icon: <LooksTwoOutlinedIcon />, name: 'Set 2nd half', values: [{ matchId: currentMatch.id, type: 14, minuteInMatch: 46 }, { matchId: currentMatch.id, type: 16, minuteInMatch: 90 }] },
        { icon: <MoreTimeOutlinedIcon />, name: 'Extra time', component: <><DialogTitle>Add new activity</DialogTitle><EventNewForm onCancel={handleCloseModal} isExtra isSecondHalf={(arrExtraTime.length === 1)} /></> },
        { icon: <EventAvailableOutlinedIcon />, name: 'Add activity', component: <><DialogTitle>Add new activity</DialogTitle><EventNewForm onCancel={handleCloseModal} /></> },
    ];
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const addNewActivity = (values) => {
        dispatch(addActivity({ ...values[0] }, (value) => {
            if (value.status !== SUCCESS) {
                dispatch(addActivity({ ...values[1], playerContractIds: [], staffContractIds: [], refereeIds: [] },
                    (value) => setErrorState(value)))

                if (values[1].type === 16) {
                    dispatch(addActivity({ ...{ matchId: currentMatch.id, type: 17, minuteInMatch: 90 }, playerContractIds: [], staffContractIds: [], refereeIds: [] },
                        (value) => setErrorState(value)))
                }
            }
        }))
    }

    useEffect(() => {
        console.log(errorState);
        if (!_.isEmpty(errorState)) {
            if (errorState.status === SUCCESS) {
                enqueueSnackbar(errorState.message, { variant: 'success' });
            }
            else {
                enqueueSnackbar(errorState.message, { variant: 'error' });
            }
        }

    }, [errorState])
    const openDialog = (component) => {
        setComponent(component)
        dispatch(openModal())
    }
    return (
        <>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item md={8} xs={12}>
                    <Card sx={{ p: 2 }}>
                        <Grid container spacing={3} sx={{ mt: 1, px: 3 }} justifyContent="center">
                            <Grid item xs={6}>
                                <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="flex-end">
                                    <Typography variant="subtitle2" noWrap>
                                        {homeClub?.name}
                                    </Typography>
                                    <Avatar alt={homeClub} src={homeClub?.imageURL} />
                                </Stack>
                            </Grid>
                            <Grid item xs={6}>
                                <Stack spacing={3} direction={{ xs: 'column-reverse', sm: 'row' }} alignItems="center" justifyContent="flex-start">
                                    <Avatar alt={awayClub} src={awayClub?.imageURL} />
                                    <Typography variant="subtitle2" noWrap>
                                        {awayClub?.name}
                                    </Typography>

                                </Stack>
                            </Grid>
                        </Grid>
                        <Timeline>
                            {currentMatch?.activities && (
                                renderActivities()
                            )}
                        </Timeline>
                    </Card>
                </Grid>
            </Grid>

            <SpeedDial
                hidden={!isAdmin}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={() => action.values ? addNewActivity(action.values) : openDialog(action.component)}
                    />
                ))}
            </SpeedDial>

            <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
                {component}
            </DialogAnimate>
        </>
    );
}
