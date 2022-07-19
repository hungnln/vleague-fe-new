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
  userList: [{
    id: 'lsXGrmgi8EPEcoMl42YHXIDsM532',
    name: 'Nguyen Le Nguyen Hung K14 HCM',
    imageURL: 'https://lh3.googleusercontent.com/a-/AOh14GjHTdTGoDiHoV4YhjpTOeFrZRKbRCNKks7p2G0yzQ=s96-c',
    email: 'hungnlnse140018@fpt.edu.vn',
    isBanned: false
  },
  {
    id: 'ZrnyrIUcasSEsPl6Ucff7l5iVaM2',
    name: 'Truong Quang Phien',
    imageURL: 'https://lh3.googleusercontent.com/a-/AOh14GiV2n4ncOhQdo2bLAMP3KhuA-J1fnMAvOpv5Sk60w=s96-c',
    email: 'phientqse140851@fpt.edu.vn',
    isBanned: false
  },
  {
    id: 'XxrP7edxoEW7BsC16Yy6CnZ2nh62',
    name: 'Call me is Phiênnn',
    imageURL: 'https://lh3.googleusercontent.com/a-/AOh14GjrbBhzz6BwUu2IUUuMiqkIyY7KATj_U9jNZocbYQ=s96-c',
    email: 'phientruong20@gmail.com',
    isBanned: false
  },
  {
    id: 'c1fOEuS5OkZVheCBKdQMcVchlyI2',
    name: 'Minh Duc Nguyen',
    imageURL: 'https://lh3.googleusercontent.com/a-/AOh14GguHNSGxyEmM497Jyp7oMzgoBod7-c6I0QH1Dr1=s96-c',
    email: 'ducnmse140716@fpt.edu.vn',
    isBanned: false
  },
  {
    id: '22nbM8LDUxfFGll3DG89QPvKD4m2',
    name: 'Nguyen Thanh Cong (K15 HCM)',
    imageURL: 'https://lh3.googleusercontent.com/a-/AOh14GjGhl9zllKmYDVyLFchG05hSE-XNu4yv075WchZ=s96-c',
    email: 'congntse151288@fpt.edu.vn',
    isBanned: false
  },
  {
    id: 'giGofxG1TaY0slM0H5i9RoWk2Q32',
    name: 'Tran Vinh An (K15 HCM)',
    imageURL: 'https://lh3.googleusercontent.com/a-/AOh14GhRCqm7NEl4sy_TDDXXBKZGY3KWTppVXfQFXpsNxw=s96-c',
    email: 'antvse151316@fpt.edu.vn',
    isBanned: false
  },
  {
    id: 'G9b6gVhuvZNOdY2GyZdUUnhHpud2',
    name: 'Hưng Nguyên',
    imageURL: 'https://lh3.googleusercontent.com/a/AATXAJxhqNwQKXG5F0MWSnMnQGTBwMBg_g13cUWDMznP=s96-c',
    email: 'nguyenhung09082000@yahoo.com',
    isBanned: false
  },
  {
    id: 'rc5AVhSpocWIbDBqZvF73hMFGR92',
    name: 'Thành Công Nguyễn',
    imageURL: 'https://lh3.googleusercontent.com/a-/AFdZucqZ4MhQwrQ9VIeGhhj3hLll4yjJ4vDE89Os_PLbcw=s96-c',
    email: 'inuyashathanhcongnguyen@gmail.com',
    isBanned: false
  },
  {
    id: 'p1uxeOulvmTGjNk6pkgDptBMMbr1',
    name: 'Mỹ Chi',
    imageURL: 'https://lh3.googleusercontent.com/a-/AFdZucoSduK6jcHWHbr8_k7QXVbXfcZdpaCLBBXEQ9gf=s96-c',
    email: 'ntmchi146@gmail.com',
    isBanned: false
  }],
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
      const response = await axios.get(`/api/accounts/${id}`);
      dispatch(slice.actions.getUserDetail(response.data.result));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function updateUserStatus(userID, isBanned, callback) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/accounts/${userID}?isBanned=${isBanned}`);
      if (response.data.statusCode === 200) {
        callback({ IsError: response.data.IsError })
        // dispatch(slice.actions.editStadium(response.data.result));

      }
      // dispatch(slice.actions.getUserDetail(response.data.result));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)
    }
  };
}

export function getUserList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/accounts');
      dispatch(slice.actions.getUserListSuccess(response.data.result));
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
