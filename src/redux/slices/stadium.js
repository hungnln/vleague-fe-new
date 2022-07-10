import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  stadiumList: [],

};

const slice = createSlice({
  name: 'stadium',
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
    addStadium(state, action) {
      state.isLoading = false;
      const newStadiumList = [...state.stadiumList, action.payload]
      state.stadiumList = newStadiumList
    },

    editStadium(state, action) {
      state.isLoading = false;
      const newStadiumList = state.stadiumList.map(stadium => {
        if (Number(stadium.id) === Number(action.payload.id)) {
          return action.payload
        }
        return stadium
      })
      state.stadiumList = newStadiumList
    },

    deleteStadium(state, action) {
      const deleteStadium = filter(state.stadiumList, (stadium) => stadium.id !== action.payload);
      state.stadiumList = deleteStadium;
    },


    getStadiumListSuccess(state, action) {
      state.isLoading = false;
      state.stadiumList = action.payload;
    },

  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteStadium } = slice.actions;

// ----------------------------------------------------------------------

export function getStadiumList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/stadiums');
      dispatch(slice.actions.getStadiumListSuccess(response.data.result));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createStadium = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/stadiums', data);
      if (response.data.statusCode === 200) {
        callback({ IsError: response.data.IsError })
        dispatch(slice.actions.addStadium(response.data.result));
      }
    } catch (error) {
      callback(error.response.data)
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const editStadium = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/stadiums/${data.id}`, data);
      if (response.data.statusCode === 200) {
        callback({ IsError: response.data.IsError })
        dispatch(slice.actions.editStadium(response.data.result));

      }
    } catch (error) {
      callback(error.response.data)
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const removeStadium = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/stadiums/${id}`);
      dispatch(slice.actions.deleteStadium(id))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
