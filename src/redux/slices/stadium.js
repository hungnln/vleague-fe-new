import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  stadiumList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  stadiumDetail: {}

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
      state.error = false;
      const { data, pagination } = state.stadiumList
      const newTotalCount = pagination.totalCount + 1 || 1
      const newData = [...data, action.payload]
      const newStadiumList = {
        data: newData,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      };
      state.stadiumList = newStadiumList;
    },

    editStadium(state, action) {
      state.isLoading = false;
      const newStadiumList = state.stadiumList.data.map(stadium => {
        if (stadium.id === action.payload.id) {
          return action.payload
        }
        return stadium
      })
      state.stadiumList.data = newStadiumList
    },

    deleteStadium(state, action) {
      const { data, pagination } = state.stadiumList;
      const newTotalCount = pagination.totalCount - 1 || 0;
      const deleteStadium = filter(data, (stadium) => stadium.id !== action.payload);
      state.stadiumList = {
        data: deleteStadium,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      }
    },


    getStadiumListSuccess(state, action) {
      state.isLoading = false;
      state.stadiumList = action.payload;
    },
    getStadiumDetail(state, action) {
      state.isLoading = false;
      state.stadiumDetail = action.payload;
    },

  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteStadium } = slice.actions;

// ----------------------------------------------------------------------

export function getStadiumList(pageIndex, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/stadiums?pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getStadiumListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createStadium = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/stadiums', data);
      dispatch(slice.actions.addStadium(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
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
      const response = await axios.put(`/stadiums/${data.id}`, data);
      dispatch(slice.actions.editStadium(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
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
      const response = await axios.delete(`/stadiums/${id}`);
      dispatch(slice.actions.deleteStadium(id))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const getStadiumDetail = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/stadiums/${id}`);
      dispatch(slice.actions.getStadiumDetail(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
