import PropTypes from 'prop-types';
import * as Yup from 'yup';
// material
import { Box, Button, Card, DialogTitle, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Scrollbar from 'src/components/Scrollbar';
import PlayerLineUpList from '../list/PlayerLineUpList';
import { useDispatch, useSelector } from 'react-redux';
import { addLineUp, addLineUpServer, closeModal, getMatchParticipation, openModal } from 'src/redux/slices/match';
import { DialogAnimate } from 'src/components/animate';
import MatchLineUpForm from '../MatchLineUpForm';
import plusFill from '@iconify/icons-eva/plus-fill';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import MatchStaffForm from '../MatchStaffForm';
import _ from 'lodash';
import MatchLineUpMoreMenu from '../list/MatchLineUpMoreMenu';
import MatchRefereeForm from '../MatchRefereeForm';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { current } from '@reduxjs/toolkit';
import useAuth from 'src/hooks/useAuth';
//

// ----------------------------------------------------------------------

Lineup.propTypes = {

};

export default function Lineup() {
    const { currentMatch, isOpenModal, matchParticipation } = useSelector((state) => state.match);
    const [component, setComponent] = useState()
    const dispatch = useDispatch();
    const { user } = useAuth()
    const isAdmin = user?.role === 'Admin'
    const { enqueueSnackbar } = useSnackbar();
    const { HomeLineUp, HomeReverse, HomeStaff, AwayLineUp, AwayReverse, AwayStaff, Referee } = matchParticipation
    const [homeSelected, setHomeSelected] = useState()
    const { homeClub, awayClub, stadium, round } = currentMatch
    const [errorState, setErrorState] = useState()
    useEffect(() => {
    }, [])
    const handleAddHomeLineup = () => {
        setComponent(
            <>
                <DialogTitle>Add {homeClub.name}  lineup</DialogTitle>
                <MatchLineUpForm currentLineUp={matchParticipation?.HomeLineUp} isHome addMember={addHomeLineup} onCancel={handleCloseModal} clubId={currentMatch.homeClubID} />
            </>)
        dispatch(openModal());
    };
    const handleAddAwayLineup = () => {
        setComponent(
            <>
                <DialogTitle>Add {awayClub.name}  lineup</DialogTitle>
                <MatchLineUpForm currentLineUp={matchParticipation?.AwayLineUp} addMember={addAwayLineup} onCancel={handleCloseModal} clubId={currentMatch.awayClubID} />
            </>)
        dispatch(openModal());
    };
    const handleAddHomeReverse = () => {
        setComponent(
            <>
                <DialogTitle>Add {homeClub.name} reverse</DialogTitle>
                <MatchLineUpForm currentLineUp={matchParticipation?.HomeReverse} isHome isReverse addMember={addHomeReverse} onCancel={handleCloseModal} clubId={currentMatch.homeClubID} />
            </>)
        dispatch(openModal());
    };
    const handleAddAwayReverse = () => {
        setComponent(
            <>
                <DialogTitle>Add {awayClub.name} reverse</DialogTitle>
                <MatchLineUpForm currentLineUp={matchParticipation?.AwayReverse} isReverse addMember={addAwayReverse} onCancel={handleCloseModal} clubId={currentMatch.awayClubID} />
            </>)
        dispatch(openModal());
    };
    const handleAddHomeStaff = () => {
        setComponent(
            <>
                <DialogTitle>Add {homeClub.name} staff</DialogTitle>
                <MatchStaffForm currentStaffList={matchParticipation?.HomeStaff} isHome addMember={addHomeStaff} onCancel={handleCloseModal} clubId={currentMatch.homeClubID} />
            </>)
        dispatch(openModal());
    };
    const handleAddAwayStaff = () => {
        setComponent(
            <>
                <DialogTitle>Add {homeClub.name} staff</DialogTitle>
                <MatchStaffForm currentStaffList={matchParticipation?.AwayStaff} isHome addMember={addAwayStaff} onCancel={handleCloseModal} clubId={currentMatch.awayClubID} />
            </>)
        dispatch(openModal());
    };
    const handleAddReferee = () => {
        setComponent(
            <>
                <DialogTitle>Add Referee</DialogTitle>
                <MatchRefereeForm currentRefereeList={matchParticipation?.Referee} addMember={addReferee} onCancel={handleCloseModal} />
            </>)
        dispatch(openModal());
    };
    const handleCloseModal = () => {
        dispatch(closeModal());
    };
    const addHomeLineup = (callback) => {
        dispatch(addLineUp({ HomeLineUp: callback }))
    }
    const addHomeStaff = (callback) => {
        dispatch(addLineUp({ HomeStaff: callback }))
    }
    const addAwayStaff = (callback) => {
        dispatch(addLineUp({ AwayStaff: callback }))
    }
    const addHomeReverse = (callback) => {
        dispatch(addLineUp({ HomeReverse: callback }))

    }
    const addAwayLineup = (callback) => {
        dispatch(addLineUp({ AwayLineUp: callback }))
    }
    const addAwayReverse = (callback) => {
        dispatch(addLineUp({ AwayReverse: callback }))
    }
    const addReferee = (callback) => {
        dispatch(addLineUp({ Referee: callback }))

    }

    const convertPlayerList = (matchParticipationObj, isReverse) => {
        const GoalKeeperConvert = { ...matchParticipationObj.GoalKeeper, role: 3 }
        const DefenderConvert = matchParticipationObj.Defender.reduce((obj, item) => { return [...obj, { ...item, role: 2 }] }, [])
        const MidfielderConvert = matchParticipationObj.Midfielder.reduce((obj, item) => { return [...obj, { ...item, role: 1 }] }, [])
        const ForwardConvert = matchParticipationObj.Forward.reduce((obj, item) => { return [...obj, { ...item, role: 0 }] }, [])
        return [GoalKeeperConvert, ...DefenderConvert, ...MidfielderConvert, ...ForwardConvert].reduce((obj, item) => { return [...obj, { PlayerContractID: item.id, Role: item.role, MatchID: currentMatch.id, InLineups: (!isReverse) }] }, [])
    }
    const convertStaffList = (matchParticipationObj) => {
        const HeadCoachConvert = { ...matchParticipationObj.HeadCoach, role: 0 }
        const AssistantCoachConvert = matchParticipationObj.AssistantCoach.reduce((obj, item) => { return [...obj, { ...item, role: 1 }] }, [])
        const MedicalTeamConvert = matchParticipationObj.MedicalTeam.reduce((obj, item) => { return [...obj, { ...item, role: 2 }] }, [])
        return [HeadCoachConvert, ...AssistantCoachConvert, ...MedicalTeamConvert].reduce((obj, item) => { return [...obj, { StaffContractID: item.id, Role: item.role, MatchID: currentMatch.id }] }, [])
    }
    const convertRefereeList = (matchParticipationObj) => {
        const HeadRefereeConvert = { ...matchParticipationObj.HeadReferee, role: 0 }
        const AssistantRefereeConvert = matchParticipationObj.AssistantReferee.reduce((obj, item) => { return [...obj, { ...item, role: 1 }] }, [])
        const MonitoringRefereeConvert = matchParticipationObj.MonitoringReferee.reduce((obj, item) => { return [...obj, { ...item, role: 2 }] }, [])
        return [HeadRefereeConvert, ...AssistantRefereeConvert, ...MonitoringRefereeConvert].reduce((obj, item) => { return [...obj, { RefereeID: item.id, Role: item.role, MatchID: currentMatch.id }] }, [])
    }
    // const homeContract = [...convertPlayerLineUp(HomeLineUp, false), ...convertPlayerLineUp(HomeReverse, true)]
    useEffect(() => {
        const HomeReverseSelected = !_.isEmpty(HomeReverse) ? [HomeReverse.GoalKeeper, ...HomeReverse.Defender, ...HomeReverse.Midfielder, ...HomeReverse.Forward] : []
        const HomeLineUpSelected = !_.isEmpty(HomeLineUp) ? [HomeLineUp.GoalKeeper, ...HomeLineUp.Defender, ...HomeLineUp.Midfielder, ...HomeLineUp.Forward] : []
        setHomeSelected([...HomeReverseSelected, ...HomeLineUpSelected])
    }, [matchParticipation])
    const renderPlayer = (object, isHome) => {
        return object ? Object.entries(object).map(([key, e]) => {
            return Array.isArray(e) ? (e.map((row, index) => {
                return isHome ? (<TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell align="left" width={70}>{row.number}</TableCell>
                    <TableCell align="left">{row?.player?.name}</TableCell>
                    <TableCell align="right">{key}</TableCell>
                </TableRow >) : (<TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell align="left">{key}</TableCell>
                    <TableCell align="right">{row?.player?.name}</TableCell>
                    <TableCell align="right" width={70}>{row.number}</TableCell>
                </TableRow >)
            })) : _.isEmpty(e) ? <></> : (isHome) ? ((<TableRow
                key={e?.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="left" width={70}>
                    {e?.number}
                </TableCell>
                <TableCell align="left">{e?.player?.name}</TableCell>
                <TableCell align="right">{key}</TableCell>
            </TableRow>)) : ((<TableRow
                key={e?.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="left">{key}</TableCell>
                <TableCell align="right">{e?.player?.name}</TableCell>
                <TableCell align="right" width={70}>
                    {e?.number}
                </TableCell>
            </TableRow>))
        }) : (<TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell align="center" rowSpan={3}>
                Not set
            </TableCell>
        </TableRow>)
    }

    const renderStaff = (object, isHome) => {
        return object ? Object.entries(object).map(([key, value]) => {
            return Array.isArray(value) ? (value.map((row, index) => {
                return isHome ? (<TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell align="left">{row?.staff?.name}</TableCell>
                    <TableCell align="right" width={70}>
                        {key}
                    </TableCell>
                    {/* <TableCell align="left">{ }</TableCell> */}
                </TableRow>) : (<TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    {/* <TableCell align="right">{ }</TableCell> */}
                    <TableCell align="left" width={70}>
                        {key}
                    </TableCell>
                    <TableCell align="right">{row?.staff?.name}</TableCell>
                </TableRow>)
            })) : isHome ? ((<TableRow
                key={value.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="left">{value?.staff?.name}</TableCell>
                <TableCell align="right" width={70}>
                    {key}
                </TableCell>
                {/* <TableCell align="left">{ }</TableCell> */}
            </TableRow>)) : ((<TableRow
                key={value.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                {/* <TableCell align="right">{ }</TableCell> */}
                <TableCell align="left" width={70}>
                    {key}
                </TableCell>
                <TableCell align="right">{value?.staff?.name}</TableCell>
            </TableRow>))
        }) : <></>
    }
    const checkPlayerList = () => {
        if (!_.isNil(matchParticipation?.HomeLineUp) && !_.isNil(matchParticipation?.AwayLineUp) && !_.isNil(matchParticipation?.HomeReverse) && !_.isNil(matchParticipation?.AwayReverse)) {
            return [...convertPlayerList(HomeLineUp, false), ...convertPlayerList(HomeReverse, true), ...convertPlayerList(AwayLineUp, false), ...convertPlayerList(AwayReverse, true)]
        }
        return []
    }
    const checkStaffList = () => {
        if (!_.isNil(matchParticipation?.HomeStaff) && !_.isNil(matchParticipation?.AwayStaff)) {
            return [...convertStaffList(HomeStaff), ...convertStaffList(AwayStaff)]
        }
        return []
    }
    const checkRefereeList = () => {
        if (!_.isNil(matchParticipation?.Referee)) {
            return [...convertRefereeList(Referee)]
        }
        return []
    }
    const renderReferee = (object) => {
        return object ? Object.entries(object).map(([key, value]) => {
            return Array.isArray(value) ? (value.map((row, index) => {
                return <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell align="left" width={70}>
                        {key}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    {/* <TableCell align="right">{ }</TableCell> */}
                </TableRow>
            })) : (<TableRow
                key={value.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="left" width={70}>
                    {key}
                </TableCell>
                <TableCell align="right">{value.name}</TableCell>
                {/* <TableCell align="right">{ }</TableCell> */}
            </TableRow>)
        }) : <></>
    }
    // const renderStadium = () => {
    //     return <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
    //         <TableCell></TableCell>
    //     </TableRow>
    // }
    const NewLineupSchema = Yup.object().shape({
        // StartDate: Yup.mixed().required('Start date is required'),
        // StadiumID: Yup.number().required('Stadium is required'),
        // PlayerParticipation: Yup.array().required('PlayerParticipation is required'),
        // StaffParticipation: Yup.array().required('StaffParticipation is required'),
        // RefereeParticipation: Yup.array().required('RefereeParticipation is required').min(4, "min 4"),

    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: currentMatch?.id || "",
            StartDate: currentMatch?.startDate || null,
            StadiumID: currentMatch?.stadiumID || null,
            PlayerParticipation: checkPlayerList(),
            StaffParticipation: checkStaffList(),
            RefereeParticipation: checkRefereeList(),

        },
        validationSchema: NewLineupSchema,
        onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
            try {
                dispatch(addLineUpServer(values, (value) => setErrorState(value)))
                // console.log("check submit", checkDisable());
                // enqueueSnackbar(matchParticipation ? 'Create success' : 'Update success', { variant: 'success' });
            } catch (error) {
                console.error(error);
                setSubmitting(false);
                setErrors(error);
            }
        }
    });
    useEffect(() => {
        if (!_.isEmpty(errorState)) {
            if (!errorState.IsError) {
                console.log('ko error');
                formik.resetForm();
                enqueueSnackbar('Update success', { variant: 'success' });
            }
            else {
                enqueueSnackbar(errorState.Message, { variant: 'error' });
            }
        }

    }, [errorState])
    const checkDisable = () => {
        return _.isEmpty(values.PlayerParticipation) || _.isEmpty(values.StaffParticipation) || _.isEmpty(values.RefereeParticipation)
    }
    const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                {isAdmin && (<Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton startIcon={<Icon icon={checkmarkFill} />} type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading..." disabled={checkDisable()}>
                        Save changes
                    </LoadingButton>
                </Box>)}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2 }}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={2}>{homeClub?.name}</TableCell>
                                        {isAdmin ? (
                                            <TableCell align='right' ><MatchLineUpMoreMenu onLineup={handleAddHomeLineup} onReverse={handleAddHomeReverse} onStaff={handleAddHomeStaff} /></TableCell>

                                        ) : <TableCell />}
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </Card>
                        {matchParticipation?.HomeLineUp && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2} >Ra sân</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderPlayer(matchParticipation?.HomeLineUp, true)}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}
                        {matchParticipation?.HomeReverse && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2} >Dự bị</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderPlayer(matchParticipation?.HomeReverse, true)}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}


                        {matchParticipation?.HomeStaff && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={1} align='left'>Staff</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderStaff(matchParticipation?.HomeStaff, true)}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}

                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2 }} >
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        {isAdmin ? (
                                            <TableCell align='left' ><MatchLineUpMoreMenu onLineup={handleAddAwayLineup} onReverse={handleAddAwayReverse} onStaff={handleAddAwayStaff} /></TableCell>

                                        ) :
                                            <TableCell />

                                        }
                                        <TableCell colSpan={2} align="right">{awayClub?.name}</TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>


                        </Card>
                        {matchParticipation?.AwayLineUp && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell colSpan={2} align="right">Ra sân</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderPlayer(matchParticipation?.AwayLineUp)}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}
                        {matchParticipation?.AwayReverse && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell colSpan={2} align="right" >Dự bị</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderPlayer(matchParticipation?.AwayReverse)}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}


                        {matchParticipation?.AwayStaff && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell colSpan={1} align="right">Staff</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderStaff(matchParticipation?.AwayStaff)}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2 }}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={1}>Referee</TableCell>
                                        {isAdmin ? (
                                            <TableCell align='right' ><MatchLineUpMoreMenu onReferee={handleAddReferee} /></TableCell>

                                        ) : <TableCell />}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {renderReferee(matchParticipation?.Referee)}
                                </TableBody>
                            </Table>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2 }}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell colSpan={1}>More infomation</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={1}>Stadium</TableCell>
                                        <TableCell colSpan={1}>{stadium.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={1}>Round</TableCell>
                                        <TableCell colSpan={1}>{round.name}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Card>
                    </Grid>
                </Grid >

                <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
                    {component}
                </DialogAnimate>
            </Form>
        </FormikProvider >
    );

}
