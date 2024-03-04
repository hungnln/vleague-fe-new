import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  isOpenModal: false,
  tournamentList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  tournamentDetail: {},
  ranks: {
    goals: [],
    redCards: [],
    yellowCards: [],
  },
  standings: [],
};

const slice = createSlice({
  name: 'tournament',
  initialState,
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

    deleteTournament(state, action) {
      const deleteTournament = filter(state.tournamentList, (tournament) => tournament.id !== action.payload);
      state.tournamentList = deleteTournament;
    },

    getTournamentListSuccess(state, action) {
      state.isLoading = false;
      state.tournamentList = action.payload;
    },
    getTournamentRank(state, action) {
      state.isLoading = false;
      state.ranks = action.payload;
    },
    getTournamentStanding(state, action) {
      state.isLoading = false;
      state.standings = action.payload;
    },

    addTournament(state, action) {
      state.isLoading = false;
      const { data, pagination } = state.tournamentList
      const newTotalCount = pagination.totalCount + 1 || 1
      const newData = [...data, action.payload]
      const newTournamentList = {
        data: newData,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      };
      state.tournamentList = newTournamentList;
    },
    editTournament(state, action) {
      state.isLoading = false;
      const newTournamentList = state.tournamentList.data.map(tournament => {
        if (tournament.id === action.payload.id) {
          return action.payload
        }
        return tournament
      })
      state.tournamentList.data = newTournamentList
    },
    getTournamentDetail(state, action) {
      state.isLoading = false;
      state.tournamentDetail = action.payload
    },

    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteTournament, openModal, closeModal } = slice.actions;

// ----------------------------------------------------------------------
export function getTournamentList(pageIndex, pageSize, name, start, end) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/tournaments?pageIndex=${pageIndex}&pageSize=${pageSize}&name=${name}&start=${start}&end=${end}`);
      dispatch(slice.actions.getTournamentListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getTournamentDetail(tournamentID) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/tournaments/${tournamentID}`);
      dispatch(slice.actions.getTournamentDetail(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createTournament = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/tournaments', data);
      dispatch(slice.actions.addTournament(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)

    }
  }
}
export const editTournament = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/tournaments/${data.id}`, data);
      dispatch(slice.actions.editTournament(response.data.data));
      callback({ status: response.data.status, message: response.data.message })

    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)

    }
  }
}
export const removeTournament = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/tournaments/${id}`);
      dispatch(slice.actions.deleteTournament(id))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const getTournamentRank = (tournamentID) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/tournaments/${tournamentID}/ranks`);

      dispatch(slice.actions.getTournamentRank(response.data.data));

    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const getTournamentStanding = (tournamentID) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/tournaments/${tournamentID}/standings`);
      dispatch(slice.actions.getTournamentStanding(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

