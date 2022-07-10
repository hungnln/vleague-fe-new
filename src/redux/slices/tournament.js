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
  tournamentList: [],
  tournamentDetail: {},
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

    addTournament(state, action) {
      state.isLoading = false;
      const newTournamentList = [...state.tournamentList, action.payload]
      state.tournamentList = newTournamentList
    },
    editTournament(state, action) {
      state.isLoading = false;
      const newTournamentList = state.tournamentList.map(tournament => {
        if (Number(tournament.id) === Number(action.payload.id)) {
          return action.payload
        }
        return tournament
      })
      state.tournamentList = newTournamentList
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
export function getTournamentList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/tournaments');
      dispatch(slice.actions.getTournamentListSuccess(response.data.result));
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getTournamentDetail(tournamentID) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/tournaments/${tournamentID}`);
      dispatch(slice.actions.getTournamentDetail(response.data.result));
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createTournament = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/tournaments', data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.addTournament(response.data.result));
        console.log('response contract', response);
        callback({ IsError: response.data.IsError })
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)

    }
  }
}
export const editTournament = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/tournaments/${data.id}`, data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.editTournament(response.data.result));
        console.log('response contract', response);
        callback({ IsError: response.data.IsError })
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)

    }
  }
}
export const removeTournament = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/tournaments/${id}`);
      dispatch(slice.actions.deleteTournament(id))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}

