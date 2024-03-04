import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  userDetail: {},
  role: {},
  userList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  isOpenModal: false,

};

const slice = createSlice({
  name: 'user',
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

    // GET PROFILE
    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.myProfile = action.payload;
    },
    getUserDetail(state, action) {
      state.isLoading = false;
      state.userDetail = action.payload;
    },

    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    },
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
    },
    editUserStatus(state, action) {
      state.isLoading = false;
      const newUserList = state.userList.map(user => {
        if (user.id === action.payload) {
          return { ...user, isBanned: !user.isBanned }
        }
        return user
      })
      state.userList = newUserList
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteUser, openModal, closeModal } = slice.actions;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
export function getUserDetail(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/accounts/${id}`);
      dispatch(slice.actions.getUserDetail(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function updateUserStatus(userID, isBanned, callback) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/accounts/${userID}?isBanned=${isBanned}`);
      callback({ status: response.data.status, message: response.data.message })
      dispatch(slice.actions.editUserStatus(userID))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)
    }
  };
}

export function getUserList(pageIndex,pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/accounts?pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getUserListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const loginToServer = (firebaseToken) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/login/firebase', { headers: { Authorization: firebaseToken } });
      dispatch(slice.actions.getProfileSuccess(response.data.result));
      localStorage.setItem('accessToken', response.data.result.token)
      localStorage.setItem('tokenExpire', response.data.result.tokenExpiresAt)
      console.log(response.data.result.token, "api token")
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const loginAdmin = (values) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/login/admin', values);
      dispatch(slice.actions.getProfileSuccess(response.data.result));
      localStorage.setItem('accessToken', response.data.result.token)
      localStorage.setItem('tokenExpire', response.data.result.tokenExpiresAt)
      console.log(response.data.result.token, "api token")
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// export const loginAdmin = (values) => {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.post('/api/login/admin', values);
//       dispatch(slice.actions.getProfileSuccess(response.data.result));
//       localStorage.setItem('accessToken', response.data.result.token)
//       localStorage.setItem('tokenExpire', response.data.result.tokenExpiresAt)
//       console.log(response.data.result.token, "api token")
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }


// ----------------------------------------------------------------------
