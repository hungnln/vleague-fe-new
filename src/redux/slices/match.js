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
  matchList: [],
  currentMatch: {},
  matchParticipation: {},
  lineup: {},
  playerMatch: {
    HomeClub: [],
    AwayClub: []
  },
  staffMatch: [],
  RefereeMatch: [],

};

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
      const deleteMatch = filter(state.matchList, (match) => match.id !== action.payload);
      state.matchList = deleteMatch;
    },

    getMatchListSuccess(state, action) {
      state.isLoading = false;
      state.matchList = action.payload;
    },

    addMatch(state, action) {
      state.isLoading = false;
      const newMatchList = [...state.matchList, action.payload]
      state.matchList = newMatchList
    },
    editMatch(state, action) {
      state.isLoading = false;
      const newMatchList = state.matchList.map(match => {
        if (Number(match.id) === Number(action.payload.id)) {
          return action.payload
        }
        return match
      })
      state.matchList = newMatchList
    },
    getMatchDetail(state, action) {
      state.isLoading = false;
      state.currentMatch = action.payload
    },
    getMatchParticipationSuccess(state, action) {
      state.isLoading = false;
      state.matchParticipation = action.payload
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
export function getMatchList(tournamentId, roundId, stadiumId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/matches?TournamentID=${tournamentId}&RoundID=${roundId}&StadiumID=${stadiumId}`);
      dispatch(slice.actions.getMatchListSuccess(response.data.result));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createMatch = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/matches', data);
      if (response.data.statusCode === 200) {
        // const activities = [{ Type: 0, MinuteInMatch: 0 }, { Type: 13, MinuteInMatch: 45 }, { Type: 14, MinuteInMatch: 46 }, { Type: 16, MinuteInMatch: 90 }]
        // activities.forEach(async activity => {
        //   const responseActivity = await axios.post(`/api/matches/${values.ID}/activities`, { ...activity, ID: response.data.result.id, PlayerContractIDs: [], StaffContractIDs: [], RefereeIDs: [] })
        dispatch(slice.actions.addMatch(response.data.result));
        callback({ IsError: response.data.IsError })
      }
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
      const response = await axios.put(`/api/matches/${data.id}`, data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.editMatch(response.data.result));
        callback({ IsError: response.data.IsError })
      }
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
      const response = await axios.get(`/api/matches/${matchId}?include=homeClub, awayClub`);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.getMatchDetail(response.data.result));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
// export const getAllPlayerMatchContract = (HomeClubID, AwayClubID) => {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const responseHome = await axios.get(`/api/player`);
//       const responseAway = await axios.get(`/api/player-contracts?ClubID=${AwayClubID}?Include=player`);
//       if (responseHome.data.statusCode === 200 && responseAway.data.statusCode === 200) {
//         dispatch(slice.actions.getPlayerMatchSuccess(responseHome.data.result, responseAway.data.result));
//       }
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   }
// }
export const getMatchParticipation = (matchId, homeClubID, awayClubID, playerList, staffList, refereeList) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
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
      const response = await axios.get(`/api/matches/${matchId}/participation`);
      const { players, staffs, referees } = response.data.result
      const convertGoalKeeper = (clubID, inLineups) => {
        return players.filter((contract) => contract.role === GOALKEEPER && contract.inLineups === inLineups && contract.playerContract.clubID === clubID).reduce((obj, item) => { return { ...item.playerContract, player: playerList.find(player => player.id === item.playerContract.playerID) } }, {})
      }
      const convertPlayerRoleArr = (clubID, role, inLineups) => {
        return players.filter((contract) => contract.role === role && contract.inLineups === inLineups && contract.playerContract.clubID === clubID).reduce((obj, item) => { return [...obj, { ...item.playerContract, player: playerList.find(player => player.id === item.playerContract.playerID) }] }, [])
      }
      const convertHeadCoach = (clubID) => {
        return staffs.filter((contract) => contract.role === HEADCOACH && contract.staffContract.clubID === clubID).reduce((obj, item) => { return { ...item.staffContract, staff: staffList.find(staff => staff.id === item.staffContract.staffID) } }, {})
      }
      const convertStaffRoleArr = (clubID, role) => {
        return staffs.filter((contract) => contract.role === role && contract.staffContract.clubID === clubID).reduce((obj, item) => { return [...obj, { ...item.staffContract, staff: staffList.find(staff => staff.id === item.staffContract.staffID) }] }, [])
      }
      const convertHeadReferee = () => {
        return referees.filter((contract) => contract.role === HEADREFEREE).reduce((obj, item) => { return { ...item.referee, referee: refereeList.find(referee => referee.id === item.refereeID) } }, {})
      }
      const convertRefereeRoleArr = (role) => {
        return referees.filter((contract) => contract.role === role).reduce((obj, item) => { return [...obj, { ...item.referee, referee: refereeList.find(referee => referee.id === item.refereeID) }] }, [])
      }
      if (!_.isEmpty(players) && !_.isEmpty(staffs) && !_.isEmpty(referees)) {
        const lineup = {
          HomeLineUp: {
            GoalKeeper: convertGoalKeeper(homeClubID, true),
            Defender: convertPlayerRoleArr(homeClubID, DEFENDER, true),
            Midfielder: convertPlayerRoleArr(homeClubID, MIDFIELDER, true),
            Forward: convertPlayerRoleArr(homeClubID, FORWARD, true),
          },
          HomeReverse: {
            GoalKeeper: convertGoalKeeper(homeClubID, false),
            Defender: convertPlayerRoleArr(homeClubID, DEFENDER, false),
            Midfielder: convertPlayerRoleArr(homeClubID, MIDFIELDER, false),
            Forward: convertPlayerRoleArr(homeClubID, FORWARD, false),
          },
          AwayLineUp: {
            GoalKeeper: convertGoalKeeper(awayClubID, true),
            Defender: convertPlayerRoleArr(awayClubID, DEFENDER, true),
            Midfielder: convertPlayerRoleArr(awayClubID, MIDFIELDER, true),
            Forward: convertPlayerRoleArr(awayClubID, FORWARD, true),
          },
          AwayReverse: {
            GoalKeeper: convertGoalKeeper(awayClubID, false),
            Defender: convertPlayerRoleArr(awayClubID, DEFENDER, false),
            Midfielder: convertPlayerRoleArr(awayClubID, MIDFIELDER, false),
            Forward: convertPlayerRoleArr(awayClubID, FORWARD, false),
          },
          HomeStaff: {
            HeadCoach: convertHeadCoach(homeClubID),
            AssistantCoach: convertStaffRoleArr(homeClubID, ASSISTANTCOACH),
            MedicalTeam: convertStaffRoleArr(homeClubID, MEDICALTEAM),
          },
          AwayStaff: {
            HeadCoach: convertHeadCoach(awayClubID),
            AssistantCoach: convertStaffRoleArr(awayClubID, ASSISTANTCOACH),
            MedicalTeam: convertStaffRoleArr(awayClubID, MEDICALTEAM),
          },
          Referee: {
            HeadReferee: convertHeadReferee(),
            AssistantReferee: convertRefereeRoleArr(ASSISTANTREFEREE),
            MonitoringReferee: convertRefereeRoleArr(MONITORINGREFEREE),
          }

        }
        dispatch(slice.actions.getMatchParticipationSuccess(lineup));

      } else {
        dispatch(slice.actions.getMatchParticipationSuccess(response.data.result));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const removeMatch = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/matches/${id}`);
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
      const response = await axios.put(`/api/matches/${values.id}`, values);
      if (response.data.statusCode === 200) {
        const { id, homeClubID, awayClubID } = response.data.result
        const responsePlayer = await axios.get(`api/players`)
        const responseStaff = await axios.get(`api/staffs`)
        const responseReferee = await axios.get(`api/referees`)

        dispatch(getMatchParticipation(id, homeClubID, awayClubID, responsePlayer.data.result, responseStaff.data.result, responseReferee.data.result,))
        callback({ IsError: response.data.IsError })
      }
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
      const response = await axios.post(`/api/matches/${values.ID}/activities`, values);
      if (response.data.statusCode === 200) {
        dispatch(getMatchDetail(values.ID))
        callback({ IsError: response.data.IsError })
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)
    }
  };
}