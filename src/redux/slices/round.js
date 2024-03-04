import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  isOpenModal: false,
  roundList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
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
      const { data, pagination } = state.roundList;
      const newTotalCount = pagination.totalCount - 1 || 0;
      const deleteRound = filter(data, (round) => round.id !== action.payload);
      state.roundList = {
        data: deleteRound,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      }
    },

    // GET MANAGE USERS
    getRoundListSuccess(state, action) {
      state.isLoading = false;
      state.roundList = action.payload;
    },

    addRound(state, action) {
      state.isLoading = false;
      const { data, pagination } = state.roundList
      const newTotalCount = pagination.totalCount + 1 || 1
      const newData = [...data, action.payload]
      const newRoundList = {
        data: newData,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      };
      state.roundList = newRoundList;
    },
    editRound(state, action) {
      state.isLoading = false;
      const newRoundList = state.roundList.data.map(round => {
        if (round.id === action.payload.id) {
          return action.payload
        }
        return round
      })
      state.roundList.data = newRoundList
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
export function getRoundList(tournamentId, pageIndex, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/rounds?tournamentId=${tournamentId}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getRoundListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createRound = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/rounds', data);
      dispatch(slice.actions.addRound(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)

    }
  }
}
export const editRound = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/rounds/${data.id}`, data);
      dispatch(slice.actions.editRound(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)
    }
  }
}
export const getRoundDetail = (roundId) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/rounds/${roundId}`);
      dispatch(slice.actions.getRoundDetail(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const removeRound = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/rounds/${id}`);
      dispatch(slice.actions.deleteRound(id))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
