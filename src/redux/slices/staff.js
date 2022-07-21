import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  staffList: [],
  contractList: [],
  staffContracts: [],
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
      const newStaffList = [...state.staffList, action.payload]
      state.staffList = newStaffList
    },

    editStaff(state, action) {
      state.isLoading = false;
      const newStaffList = state.staffList.map(staff => {
        if (Number(staff.id) === Number(action.payload.id)) {
          return action.payload
        }
        return staff
      })
      state.staffList = newStaffList
    },

    deleteStaff(state, action) {
      const deleteStaff = filter(state.staffList, (staff) => staff.id !== action.payload);
      state.staffList = deleteStaff;
    },

    getContractList(state, action) {
      state.error = false;
      state.isLoading = false;
      state.contractList = action.payload;
    },

    addContract(state, action) {
      state.isLoading = false;
      const newContractList = [...state.contractList, action.payload]
      state.contractList = newContractList
    },

    editContract(state, action) {
      state.isLoading = false;
      const newContractList = state.contractList.map(contract => {
        if (Number(contract.id) === Number(action.payload.id)) {
          return action.payload
        }
        return contract
      })
      state.contractList = newContractList
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
export function getStaffList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staffs');
      dispatch(slice.actions.getStaffListSuccess(response.data.result));
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));
    }
  };
}
export const createStaff = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/staffs', data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.addStaff(response.data.result));
        callback({ IsError: response.data.IsError })
      }
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
      const response = await axios.put(`/api/staffs/${data.id}`, data);
      if (response.data.statusCode === 200) {
        callback({ IsError: response.data.IsError })
        dispatch(slice.actions.editStaff(response.data.result));
      }
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
      const response = await axios.post('/api/staff-contracts', data);
      if (response.data.statusCode === 200) {
        const contractResponse = await axios.get(`/api/staff-contracts/${response.data.result.id}?Include=staff, club`);
        dispatch(slice.actions.addContract(contractResponse.data.result));
        callback({ IsError: response.data.IsError })

      }
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
      const response = await axios.put(`/api/staff-contracts/${id}`, data);
      if (response.data.statusCode === 200) {
        const contractResponse = await axios.get(`/api/staff-contracts/${response.data.result.id}?Include=staff, club`);
        dispatch(slice.actions.editContract(contractResponse.data.result));
        callback({ IsError: response.data.IsError })
      }
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
      const response = await axios.delete(`/api/staffs/${id}`);
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
      const response = await axios.delete(`/api/staff-contracts/${id}`);
      dispatch(getContractList('', 'staff, club'))
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}
export const getContract = (id, include) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/staff-contracts/${id}?Include=${include}`);
      dispatch(slice.actions.getCurrentContract(response.data.result))
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}
export const getContractList = (id, include) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/staff-contracts?StaffID=${id}&Include=${include}`);
      dispatch(slice.actions.getContractList(response.data.result))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

export const getStaffDetail = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/staffs/${id}`);
      dispatch(slice.actions.getStaffDetail(response.data.result))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const getClubMatchContract = (ClubID, start) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/staff-contracts?ClubID=${ClubID}&IncludeEndedContracts=false&Include=staff&Start=${start}`);
      dispatch(slice.actions.getClubContractList(response.data.result))
    }
    catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}
