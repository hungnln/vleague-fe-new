import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  isOpenModal: false,
  roundList: [],
  currentRound: {}
};

const slice = createSlice({
  name: 'round',
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
  
    // DELETE USERS
    deleteRound(state, action) {
      const deleteRound = filter(state.roundList, (round) => round.id !== action.payload);
      state.roundList = deleteRound;
    },

    // GET MANAGE USERS
    getRoundListSuccess(state, action) {
      state.isLoading = false;
      state.roundList = action.payload;
    },
  
    addRound(state, action) {
      state.isLoading = false;
      const newRoundList = [...state.roundList, action.payload]
      state.roundList = newRoundList
    },
    editRound(state, action) {
      state.isLoading = false;
      const newRoundList = state.roundList.map(round => {
        if (Number(round.id) === Number(action.payload.id)) {
          return action.payload
        }
        return round
      })
      state.roundList = newRoundList
    },
    getRoundDetail(state, action) {
      state.isLoading = false;
      state.currentRound = action.payload
    },
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
    }
  },

});

// Reducer
export default slice.reducer;
// Actions
export const { onToggleFollow, deleteRound, openModal, closeModal } = slice.actions;
// ----------------------------------------------------------------------
export function getRoundList(tournamentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/rounds?TournamentID=${tournamentId}`);
      dispatch(slice.actions.getRoundListSuccess(response.data.result));
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createRound = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/rounds', data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.addRound(response.data.result));
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
export const editRound = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/rounds/${data.id}`, data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.editRound(response.data.result));
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
export const getRoundDetail = (roundId) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/rounds/${roundId}`);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.getRoundDetail(response.data.result));
        console.log('response round', response);
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const removeRound = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/rounds/${id}`);
      dispatch(slice.actions.deleteRound(id))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
