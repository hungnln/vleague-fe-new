import _, { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  isOpenModal: false,
  matchList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  currentMatch: {},
  matchParticipation: {},
  matchStatistic: {},
  lineup: {},
  // playerMatch: {
  //   HomeClub: [],
  //   AwayClub: []
  // },
  // staffMatch: [],
  // RefereeMatch: [],

};
const DEFENDER = "Defender"
const GOALKEEPER = "GoalKeeper"
const MIDFIELDER = "Midfielder"
const FORWARD = "Forward"
const HEADCOACH = "HeadCoach"
const ASSISTANTCOACH = "AssistantCoach"
const MEDICALTEAM = "MedicalTeam"
const HEADREFEREE = "HeadReferee"
const ASSISTANTREFEREE = "AssistantReferee"
const MONITORINGREFEREE = "MonitoringReferee"
const slice = createSlice({
  name: 'match',
  initialState,
  extraReducers: {

  },
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteMatch(state, action) {
      const { data, pagination } = state.matchList;
      const newTotalCount = pagination.totalCount - 1 || 0;
      const deleteMatch = filter(data, (match) => match.id !== action.payload);
      state.matchList = {
        data: deleteMatch,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      }
    },

    getMatchListSuccess(state, action) {
      state.isLoading = false;
      state.matchList = action.payload;
    },
    getMatchStatistic(state, action) {
      state.isLoading = false;
      state.matchStatistic = action.payload;
    },

    addMatch(state, action) {
      state.isLoading = false;
      const { data, pagination } = state.matchList
      const newTotalCount = pagination.totalCount + 1 || 1
      const newData = [...data, action.payload]
      const newMatchList = {
        data: newData,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      };
      state.matchList = newMatchList;
    },
    editMatch(state, action) {
      state.isLoading = false;
      const newMatchList = state.matchList.data.map(match => {
        if (match.id === action.payload.id) {
          return action.payload
        }
        return match
      })
      state.matchList.data = newMatchList
    },
    getMatchDetail(state, action) {
      state.isLoading = false;
      state.currentMatch = action.payload
    },
    getMatchParticipationSuccess(state, action) {
      const { match, playerMatchParticipations, staffMatchParticipations, refereeMatchParticipations } = action.payload

      state.isLoading = false;

      const convertGoalKeeper = (clubId, inLineups) => {
        console.log(match, 'chceck club id');
        return playerMatchParticipations.filter((contract) => contract.role === GOALKEEPER && contract.inLineups === inLineups && contract.playerContract.club.id === clubId).reduce((obj, item) => { return { ...item.playerContract } }, {})
      }
      const convertPlayerRoleArr = (clubId, role, inLineups) => {
        return playerMatchParticipations.filter((contract) => contract.role === role && contract.inLineups === inLineups && contract.playerContract.club.id === clubId).reduce((obj, item) => { return [...obj, { ...item.playerContract }] }, [])
      }
      const convertHeadCoach = (clubId) => {
        return staffMatchParticipations.filter((contract) => contract.role === HEADCOACH && contract.staffContract.club.id === clubId).reduce((obj, item) => { return { ...item.staffContract } }, {})
      }
      const convertStaffRoleArr = (clubId, role) => {
        return staffMatchParticipations.filter((contract) => contract.role === role && contract.staffContract.club.id === clubId).reduce((obj, item) => { return [...obj, { ...item.staffContract }] }, [])
      }
      const convertHeadReferee = () => {
        return refereeMatchParticipations.filter((contract) => contract.role === HEADREFEREE).reduce((obj, item) => { return { ...item.referee } }, {})
      }
      const convertRefereeRoleArr = (role) => {
        return refereeMatchParticipations.filter((contract) => contract.role === role).reduce((obj, item) => { return [...obj, { ...item.referee }] }, [])
      }
      const homeClubId = match.homeClub.id;
      const awayClubId = match.awayClub.id;
      if (!_.isEmpty(playerMatchParticipations) && !_.isEmpty(staffMatchParticipations) && !_.isEmpty(refereeMatchParticipations)) {
        const lineup = {
          homeLineUp: {
            goalKeeper: convertGoalKeeper(homeClubId, true),
            defender: convertPlayerRoleArr(homeClubId, DEFENDER, true),
            midfielder: convertPlayerRoleArr(homeClubId, MIDFIELDER, true),
            forward: convertPlayerRoleArr(homeClubId, FORWARD, true),
          },
          homeReverse: {
            goalKeeper: convertGoalKeeper(homeClubId, false),
            defender: convertPlayerRoleArr(homeClubId, DEFENDER, false),
            midfielder: convertPlayerRoleArr(homeClubId, MIDFIELDER, false),
            forward: convertPlayerRoleArr(homeClubId, FORWARD, false),
          },
          awayLineUp: {
            goalKeeper: convertGoalKeeper(awayClubId, true),
            defender: convertPlayerRoleArr(awayClubId, DEFENDER, true),
            midfielder: convertPlayerRoleArr(awayClubId, MIDFIELDER, true),
            forward: convertPlayerRoleArr(awayClubId, FORWARD, true),
          },
          awayReverse: {
            goalKeeper: convertGoalKeeper(awayClubId, false),
            defender: convertPlayerRoleArr(awayClubId, DEFENDER, false),
            midfielder: convertPlayerRoleArr(awayClubId, MIDFIELDER, false),
            forward: convertPlayerRoleArr(awayClubId, FORWARD, false),
          },
          homeStaff: {
            headCoach: convertHeadCoach(homeClubId),
            assistantCoach: convertStaffRoleArr(homeClubId, ASSISTANTCOACH),
            medicalTeam: convertStaffRoleArr(homeClubId, MEDICALTEAM),
          },
          awayStaff: {
            headCoach: convertHeadCoach(awayClubId),
            assistantCoach: convertStaffRoleArr(awayClubId, ASSISTANTCOACH),
            medicalTeam: convertStaffRoleArr(awayClubId, MEDICALTEAM),
          },
          referee: {
            headReferee: convertHeadReferee(),
            assistantReferee: convertRefereeRoleArr(ASSISTANTREFEREE),
            monitoringReferee: convertRefereeRoleArr(MONITORINGREFEREE),
          }
        }
        state.matchParticipation = lineup
      } else {
        state.matchParticipation = []

      }
    },
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
    },
    addLineUp(state, action) {
      state.isLoading = false;
      state.matchParticipation = { ...state.matchParticipation, ...action.payload }
    },
    addActivity(state, action) {
      state.isLoading = false;
      const oldActivity = state.currentMatch.activities
      const newActivity = [...oldActivity, action.payload]
      state.currentMatch.activities = newActivity
    },

  },

});

// Reducer
export default slice.reducer;
// Actions
export const { onToggleFollow, deleteMatch, openModal, closeModal } = slice.actions;
export function getMatchList(tournamentId, roundId, stadiumId, pageIndex, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/matches?tournamentId=${tournamentId || ""}&roundId=${roundId || ""}&stadiumId=${stadiumId || ""}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getMatchListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createMatch = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/matches', data);
      dispatch(slice.actions.addMatch(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)

    }
  }
}
export const editMatch = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/matches/${data.id}`, data);
      dispatch(slice.actions.editMatch(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)

    }
  }
}
export const getMatchDetail = (matchId) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/matches/${matchId}`);
      dispatch(slice.actions.getMatchDetail(response.data.data));

    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
// export const getAllPlayerMatchContract = (HomeClubID, AwayClubID) => {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const responseHome = await axios.get(`/player`);
//       const responseAway = await axios.get(`/player-contracts?ClubID=${AwayClubID}?Include=player`);
//       if (responseHome.data.statusCode === 200 && responseAway.data.statusCode === 200) {
//         dispatch(slice.actions.getPlayerMatchSuccess(responseHome.data.result, responseAway.data.result));
//       }
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   }
// }
export const getMatchParticipation = (matchId, homeClubID, awayClubID) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const response = await axios.get(`/matches/${matchId}/participation`);
      // const DEFENDER = "Defender"
      // const GOALKEEPER = "GoalKeeper"
      // const MIDFIELDER = "Midfielder"
      // const FORWARD = "Forward"
      // const HEADCOACH = "HeadCoach"
      // const ASSISTANTCOACH = "AssistantCoach"
      // const MEDICALTEAM = "MedicalTeam"
      // const HEADREFEREE = "HeadReferee"
      // const ASSISTANTREFEREE = "AssistantReferee"
      // const MONITORINGREFEREE = "MonitoringReferee"
      const response = await axios.get(`/matches/${matchId}/participation`);
      // const { players, staffs, referees } = response.data.result
      // const convertGoalKeeper = (clubID, inLineups) => {
      //   return players.filter((contract) => contract.role === GOALKEEPER && contract.inLineups === inLineups && contract.playerContract.clubID === clubID)
      // }
      // const convertPlayerRoleArr = (clubID, role, inLineups) => {
      //   return players.filter((contract) => contract.role === role && contract.inLineups === inLineups && contract.playerContract.clubID === clubID)
      // }
      // const convertHeadCoach = (clubID) => {
      //   return staffs.filter((contract) => contract.role === HEADCOACH && contract.staffContract.clubID === clubID)
      // }
      // const convertStaffRoleArr = (clubID, role) => {
      //   return staffs.filter((contract) => contract.role === role && contract.staffContract.clubID === clubID)
      // }
      // const convertHeadReferee = () => {
      //   return referees.filter((contract) => contract.role === HEADREFEREE)
      // }
      // const convertRefereeRoleArr = (role) => {
      //   return referees.filter((contract) => contract.role === role)
      // }
      // // const { homeClubID, awayClubID } = slice.initialState.currentMatch
      // console.log(matchId, homeClubID, awayClubID, 'check id');

      // console.log(players, staffs, referees, 'check');
      // if (!_.isEmpty(players) && !_.isEmpty(staffs) && !_.isEmpty(referees)) {
      //   const lineup = {
      //     HomeLineUp: {
      //       GoalKeeper: convertGoalKeeper(homeClubID, true),
      //       Defender: convertPlayerRoleArr(homeClubID, DEFENDER, true),
      //       Midfielder: convertPlayerRoleArr(homeClubID, MIDFIELDER, true),
      //       Forward: convertPlayerRoleArr(homeClubID, FORWARD, true),
      //     },
      //     HomeReverse: {
      //       GoalKeeper: convertGoalKeeper(homeClubID, false),
      //       Defender: convertPlayerRoleArr(homeClubID, DEFENDER, false),
      //       Midfielder: convertPlayerRoleArr(homeClubID, MIDFIELDER, false),
      //       Forward: convertPlayerRoleArr(homeClubID, FORWARD, false),
      //     },
      //     AwayLineUp: {
      //       GoalKeeper: convertGoalKeeper(awayClubID, true),
      //       Defender: convertPlayerRoleArr(awayClubID, DEFENDER, true),
      //       Midfielder: convertPlayerRoleArr(awayClubID, MIDFIELDER, true),
      //       Forward: convertPlayerRoleArr(awayClubID, FORWARD, true),
      //     },
      //     AwayReverse: {
      //       GoalKeeper: convertGoalKeeper(awayClubID, false),
      //       Defender: convertPlayerRoleArr(awayClubID, DEFENDER, false),
      //       Midfielder: convertPlayerRoleArr(awayClubID, MIDFIELDER, false),
      //       Forward: convertPlayerRoleArr(awayClubID, FORWARD, false),
      //     },
      //     HomeStaff: {
      //       HeadCoach: convertHeadCoach(homeClubID),
      //       AssistantCoach: convertStaffRoleArr(homeClubID, ASSISTANTCOACH),
      //       MedicalTeam: convertStaffRoleArr(homeClubID, MEDICALTEAM),
      //     },
      //     AwayStaff: {
      //       HeadCoach: convertHeadCoach(awayClubID),
      //       AssistantCoach: convertStaffRoleArr(awayClubID, ASSISTANTCOACH),
      //       MedicalTeam: convertStaffRoleArr(awayClubID, MEDICALTEAM),
      //     },
      //     Referee: {
      //       HeadReferee: convertHeadReferee(),
      //       AssistantReferee: convertRefereeRoleArr(ASSISTANTREFEREE),
      //       MonitoringReferee: convertRefereeRoleArr(MONITORINGREFEREE),
      //     }

      //   }
      //   dispatch(slice.actions.getMatchParticipationSuccess(lineup));

      // } else {
      dispatch(slice.actions.getMatchParticipationSuccess(response.data.data));
      // }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const removeMatch = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/matches/${id}`);
      dispatch(slice.actions.deleteMatch(id))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export function addLineUp(object) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.addLineUp(object));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function addLineUpServer(values, callback) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/matches/${values.matchId}`, values);
      // if (response.data.statusCode === 200) {
      //   const { id, homeClubID, awayClubID } = response.data.result
      //   const responsePlayer = await axios.get(`api/players`)
      //   const responseStaff = await axios.get(`api/staffs`)
      //   const responseReferee = await axios.get(`api/referees`)

      // dispatch(getMatchParticipation(id, homeClubID, awayClubID, responsePlayer.data.result, responseStaff.data.result, responseReferee.data.result,))
      callback({ status: response.data.status, message: response.data.message })

      // }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)
    }
  };
}
export function addActivity(values, callback) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/matches/${values.matchId}/activities`, values);
      dispatch(getMatchDetail(values.matchId))
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)
    }
  };
}
export function getMatchStatistic(matchId) {
  console.log(matchId, 'checkid');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/matches/${matchId}/stats`);
      
        dispatch(slice.actions.getMatchStatistic(response.data.data.matchStatistic))
      
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}