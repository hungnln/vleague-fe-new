import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  staffList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  contractList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  staffDetail: null,
  currentContract: {},
  clubContractList: [],
  HomeStaffContract: [],
  AwayStaffContract: [],

};

const slice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = { ...action.payload };
    },

    addStaff(state, action) {
      state.isLoading = false;
      state.error = false;
      const { data, pagination } = state.staffList
      const newTotalCount = pagination.totalCount + 1 || 1
      const newData = [...data, action.payload]
      const newStaffList = {
        data: newData,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      };
      state.staffList = newStaffList;
    },

    editStaff(state, action) {
      state.isLoading = false;
      const newStaffList = state.staffList.data.map(staff => {
        if (staff.id === action.payload.id) {
          return action.payload;
        }
        return staff;
      })
      state.staffList.data = newStaffList;
    },

    deleteStaff(state, action) {
      const { data, pagination } = state.staffList;
      const newTotalCount = pagination.totalCount - 1 || 0;
      const deleteStaff = filter(data, (staff) => staff.id !== action.payload);
      state.staffList = {
        data: deleteStaff,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      }
    },

    getContractList(state, action) {
      state.error = false;
      state.isLoading = false;
      state.contractList = action.payload;
    },

    addContract(state, action) {
      state.isLoading = false;
      state.error = false;
      const { data, pagination } = state.contractList
      const newTotalCount = pagination.totalCount + 1 || 1
      const newData = [...data, action.payload]
      const newContractList = {
        data: newData,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      };
      state.contractList = newContractList;
    },

    editContract(state, action) {
      state.isLoading = false;
      const newContractList = state.contractList.data.map(contract => {
        if (contract.id === action.payload.id) {
          return action.payload
        }
        return contract
      })
      state.contractList.data = newContractList
    },
    deleteContract(state, action) {
      const { data, pagination } = state.contractList;
      const newTotalCount = pagination.totalCount - 1 || 0;
      const deleteContract = filter(data, (contract) => contract.id !== action.payload);
      state.contractList = {
        data: deleteContract,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      }
    },
    getClubContractList(state, action) {
      state.isLoading = false;
      state.clubContractList = action.payload
    },

    getCurrentContract(state, action) {
      state.isLoading = false;
      state.currentContract = action.payload;
    },

    getStaffDetail(state, action) {
      state.isLoading = false;
      state.staffDetail = action.payload;
    },

    getStaffListSuccess(state, action) {
      state.isLoading = false;
      state.staffList = action.payload;
    },
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteStaff } = slice.actions;

// ----------------------------------------------------------------------
export function getStaffList(pageIndex, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/staffs?pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getStaffListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));
    }
  };
}
export const createStaff = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/staffs', data);
      dispatch(slice.actions.addStaff(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));
      callback(error.response.data)
    }
  }
}
export const editStaff = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/staffs/${data.id}`, data);
      dispatch(slice.actions.editStaff(response.data.data));
      callback({ status: response.data.status, message: response.data.message })

    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));
      callback(error.response.data)

    }
  }
}
export const createContract = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/staff-contracts', data);
      dispatch(slice.actions.addContract(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));
      callback(error.response.data)
    }
  }
}
export const editContract = (id, data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/staff-contracts/${id}`, data);
      dispatch(slice.actions.editContract(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));
      callback(error.response.data)


    }
  }
}
export const removeStaff = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/staffs/${id}`);
      dispatch(slice.actions.deleteStaff(id))
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));
    }
  }
}
export const removeContract = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/staff-contracts/${id}`);
      dispatch(slice.actions.deleteContract(id))
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}
export const getContract = (id, include) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/staff-contracts/${id}?Include=${include}`);
      dispatch(slice.actions.getCurrentContract(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}
export const getContractList = (id, include) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/staff-contracts?staffId=${id}&Include=${include}`);
      dispatch(slice.actions.getContractList(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

export const getStaffDetail = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/staffs/${id}`);
      dispatch(slice.actions.getStaffDetail(response.data.data))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const getClubMatchContract = (ClubID, start,pageIndex,pageSize) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/staff-contracts?clubId=${ClubID}&includeEndedContracts=false&Include=staff&matchDate=${start}pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getClubContractList(response.data.data))
    }
    catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}
