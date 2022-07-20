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
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
// ----------------------------------------------------------------------

Statistic.propTypes = {

};

export default function Statistic() {
    const listIcon = {
        "Foul": <ReportProblemIcon sx={{ color: 'yellow' }} />,
        "RedCard": <ViewCarouselIcon sx={{ color: 'red' }} />,
        "YellowCard": <ViewCarouselIcon sx={{ color: 'yellow' }} />,
        "Offside": <FlagIcon sx={{ color: 'yellow' }} />,
        // "KickOff": <></>,
        // "Penalty": <></>,
        "Corner": <SportsScoreIcon />,
        // "ThrowIn": <></>,
        // "Header": <></>,
        // "BackHeel": <></>,
    }
    const { matchStatistic, currentMatch } = useSelector(state => state.match);
    const { homeClub, awayClub, homeClubID, awayClubID } = currentMatch;
    const renderStatistic = () => {
        return Object.entries(listIcon).map(([key, value]) => {
            return <>
                <Grid item xs={5} textAlign="right">
                    {matchStatistic[homeClubID][key]}
                </Grid>
                <Grid item xs={2} textAlign="center">
                    {value}
                    <Typography variant="subtitle2" noWrap>
                        {key}
                    </Typography>

                </Grid>
                <Grid item xs={5} textAlign="left">
                    {matchStatistic[awayClubID][key]}
                </Grid>
            </>
        }
        )

    }
    return (
        <>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid item md={8} xs={12}>
                    <Card sx={{ p: 2 }}>
                        <Grid container spacing={3} sx={{ mt: 1, px: 3 }} justifyContent="center" alignItems="center">
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
                            {renderStatistic()}
                        </Grid>

                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
