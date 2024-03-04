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
import { SUCCESS } from 'src/config';
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
    const { homeLineUp, homeReverse, homeStaff, awayLineUp, awayReverse, awayStaff, referee } = matchParticipation
    const [homeSelected, setHomeSelected] = useState()
    const { homeClub, awayClub, stadium, round } = currentMatch
    const [errorState, setErrorState] = useState()
    useEffect(() => {
    }, [])
    const handleAddHomeLineup = () => {
        setComponent(
            <>
                <DialogTitle>Add {homeClub.name}  lineup</DialogTitle>
                <MatchLineUpForm currentLineUp={matchParticipation?.homeLineUp} isHome addMember={addHomeLineup} onCancel={handleCloseModal} clubId={currentMatch.homeClubId} startDate={currentMatch.startDate} />
            </>)
        dispatch(openModal());
    };
    const handleAddAwayLineup = () => {
        setComponent(
            <>
                <DialogTitle>Add {awayClub.name}  lineup</DialogTitle>
                <MatchLineUpForm currentLineUp={matchParticipation?.awayLineUp} addMember={addAwayLineup} onCancel={handleCloseModal} clubId={currentMatch.awayClubId} startDate={currentMatch.startDate} />
            </>)
        dispatch(openModal());
    };
    const handleAddHomeReverse = () => {
        setComponent(
            <>
                <DialogTitle>Add {homeClub.name} reverse</DialogTitle>
                <MatchLineUpForm currentLineUp={matchParticipation?.homeReverse} isHome isReverse addMember={addHomeReverse} onCancel={handleCloseModal} clubId={currentMatch.homeClubId} startDate={currentMatch.startDate} />
            </>)
        dispatch(openModal());
    };
    const handleAddAwayReverse = () => {
        setComponent(
            <>
                <DialogTitle>Add {awayClub.name} reverse</DialogTitle>
                <MatchLineUpForm currentLineUp={matchParticipation?.awayReverse} isReverse addMember={addAwayReverse} onCancel={handleCloseModal} clubId={currentMatch.awayClubId} startDate={currentMatch.startDate} />
            </>)
        dispatch(openModal());
    };
    const handleAddHomeStaff = () => {
        setComponent(
            <>
                <DialogTitle>Add {homeClub.name} staff</DialogTitle>
                <MatchStaffForm currentStaffList={matchParticipation?.homeStaff} isHome addMember={addHomeStaff} onCancel={handleCloseModal} clubId={currentMatch.homeClubId} startDate={currentMatch.startDate} />
            </>)
        dispatch(openModal());
    };
    const handleAddAwayStaff = () => {
        setComponent(
            <>
                <DialogTitle>Add {homeClub.name} staff</DialogTitle>
                <MatchStaffForm currentStaffList={matchParticipation?.awayStaff} isHome addMember={addAwayStaff} onCancel={handleCloseModal} clubId={currentMatch.awayClubId} startDate={currentMatch.startDate}/>
            </>)
        dispatch(openModal());
    };
    const handleAddReferee = () => {
        setComponent(
            <>
                <DialogTitle>Add Referee</DialogTitle>
                <MatchRefereeForm currentRefereeList={matchParticipation?.referee} addMember={addReferee} onCancel={handleCloseModal} />
            </>)
        dispatch(openModal());
    };
    const handleCloseModal = () => {
        dispatch(closeModal());
    };
    const addHomeLineup = (callback) => {
        dispatch(addLineUp({ homeLineUp: callback }))
    }
    const addHomeStaff = (callback) => {
        dispatch(addLineUp({ homeStaff: callback }))
    }
    const addAwayStaff = (callback) => {
        dispatch(addLineUp({ awayStaff: callback }))
    }
    const addHomeReverse = (callback) => {
        dispatch(addLineUp({ homeReverse: callback }))

    }
    const addAwayLineup = (callback) => {
        dispatch(addLineUp({ awayLineUp: callback }))
    }
    const addAwayReverse = (callback) => {
        dispatch(addLineUp({ awayReverse: callback }))
    }
    const addReferee = (callback) => {
        dispatch(addLineUp({ referee: callback }))

    }

    const convertPlayerList = (matchParticipationObj, isReverse) => {
        const goalKeeperConvert = { ...matchParticipationObj.goalKeeper, role: 3 }
        const defenderConvert = matchParticipationObj.defender.reduce((obj, item) => { return [...obj, { ...item, role: 2 }] }, [])
        const midfielderConvert = matchParticipationObj.midfielder.reduce((obj, item) => { return [...obj, { ...item, role: 1 }] }, [])
        const forwardConvert = matchParticipationObj.forward.reduce((obj, item) => { return [...obj, { ...item, role: 0 }] }, [])
        return [goalKeeperConvert, ...defenderConvert, ...midfielderConvert, ...forwardConvert].reduce((obj, item) => { return [...obj, { playerContractId: item.id, role: item.role, matchId: currentMatch.id, inLineups: (!isReverse) }] }, [])
    }
    const convertStaffList = (matchParticipationObj) => {
        const headCoachConvert = { ...matchParticipationObj.headCoach, role: 0 }
        const assistantCoachConvert = matchParticipationObj.assistantCoach.reduce((obj, item) => { return [...obj, { ...item, role: 1 }] }, [])
        const medicalTeamConvert = matchParticipationObj.medicalTeam.reduce((obj, item) => { return [...obj, { ...item, role: 2 }] }, [])
        return [headCoachConvert, ...assistantCoachConvert, ...medicalTeamConvert].reduce((obj, item) => { return [...obj, { staffContractId: item.id, role: item.role, matchId: currentMatch.id }] }, [])
    }
    const convertRefereeList = (matchParticipationObj) => {
        const headRefereeConvert = { ...matchParticipationObj.headReferee, role: 0 }
        const assistantRefereeConvert = matchParticipationObj.assistantReferee.reduce((obj, item) => { return [...obj, { ...item, role: 1 }] }, [])
        const monitoringRefereeConvert = matchParticipationObj.monitoringReferee.reduce((obj, item) => { return [...obj, { ...item, role: 2 }] }, [])
        return [headRefereeConvert, ...assistantRefereeConvert, ...monitoringRefereeConvert].reduce((obj, item) => { return [...obj, { refereeId: item.id, role: item.role, matchId: currentMatch.id }] }, [])
    }
    // const homeContract = [...convertPlayerLineUp(homeLineUp, false), ...convertPlayerLineUp(homeReverse, true)]
    useEffect(() => {
        const homeReverseSelected = !_.isEmpty(homeReverse) ? [homeReverse.goalKeeper, ...homeReverse.defender, ...homeReverse.midfielder, ...homeReverse.forward] : []
        const homeLineUpSelected = !_.isEmpty(homeLineUp) ? [homeLineUp.goalKeeper, ...homeLineUp.defender, ...homeLineUp.midfielder, ...homeLineUp.forward] : []
        setHomeSelected([...homeReverseSelected, ...homeLineUpSelected])
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
        if (!_.isNil(matchParticipation?.homeLineUp) && !_.isNil(matchParticipation?.awayLineUp) && !_.isNil(matchParticipation?.homeReverse) && !_.isNil(matchParticipation?.awayReverse)) {
            return [...convertPlayerList(homeLineUp, false), ...convertPlayerList(homeReverse, true), ...convertPlayerList(awayLineUp, false), ...convertPlayerList(awayReverse, true)]
        }
        return []
    }
    const checkStaffList = () => {
        if (!_.isNil(matchParticipation?.homeStaff) && !_.isNil(matchParticipation?.awayStaff)) {
            return [...convertStaffList(homeStaff), ...convertStaffList(awayStaff)]
        }
        return []
    }
    const checkRefereeList = () => {
        if (!_.isNil(matchParticipation?.referee)) {
            return [...convertRefereeList(referee)]
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
            matchId: currentMatch?.id || "",
            startDate: currentMatch?.startDate || null,
            stadiumId: currentMatch?.stadiumId || null,
            playerParticipation: checkPlayerList(),
            staffParticipation: checkStaffList(),
            refereeParticipation: checkRefereeList(),

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
            if (errorState.status === SUCCESS) {
              formik.resetForm();
              enqueueSnackbar(errorState.message, { variant: 'success' });
            }
            else {
              enqueueSnackbar(errorState.message, { variant: 'error' });
            }
          }

    }, [errorState])
    const checkDisable = () => {
        return _.isEmpty(values.playerParticipation) || _.isEmpty(values.staffParticipation) || _.isEmpty(values.refereeParticipation)
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
                        {matchParticipation?.homeLineUp && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2} >Ra sân</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderPlayer(matchParticipation?.homeLineUp, true)}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}
                        {matchParticipation?.homeReverse && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2} >Dự bị</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderPlayer(matchParticipation?.homeReverse, true)}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}


                        {matchParticipation?.homeStaff && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={1} align='left'>Staff</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderStaff(matchParticipation?.homeStaff, true)}
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
                        {matchParticipation?.awayLineUp && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell colSpan={2} align="right">Ra sân</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderPlayer(matchParticipation?.awayLineUp)}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}
                        {matchParticipation?.awayReverse && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell colSpan={2} align="right" >Dự bị</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderPlayer(matchParticipation?.awayReverse)}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}


                        {matchParticipation?.awayStaff && (
                            <Card sx={{ p: 2, mt: 3 }}>
                                <Table size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell colSpan={1} align="right">Staff</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderStaff(matchParticipation?.awayStaff)}
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
                                    {renderReferee(matchParticipation?.referee)}
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
