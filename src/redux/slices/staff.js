import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  posts: [],
  staffs: [],
  staffList: [],
  followers: [],
  friends: [],
  gallery: [],
  cards: null,
  addressBook: [],
  invoices: [],
  notifications: null,
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

    // GET PROFILE
    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.myProfile = action.payload;
    },

    // GET POSTS
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.posts = action.payload;
    },

    // GET USERS
    getStaffsSuccess(state, action) {
      state.isLoading = false;
      state.staffs = action.payload;
    },

    // DELETE USERS
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

    // GET FOLLOWERS
    getFollowersSuccess(state, action) {
      state.isLoading = false;
      state.followers = action.payload;
    },

    // ON TOGGLE FOLLOW
    onToggleFollow(state, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed
          };
        }
        return follower;
      });

      state.followers = handleToggle;
    },

    // GET FRIENDS
    getFriendsSuccess(state, action) {
      state.isLoading = false;
      state.friends = action.payload;
    },

    // GET GALLERY
    getGallerySuccess(state, action) {
      state.isLoading = false;
      state.gallery = action.payload;
    },

    // GET MANAGE USERS
    getStaffListSuccess(state, action) {
      state.isLoading = false;
      state.staffList = action.payload;
    },

    // GET CARDS
    getCardsSuccess(state, action) {
      state.isLoading = false;
      state.cards = action.payload;
    },

    // GET ADDRESS BOOK
    getAddressBookSuccess(state, action) {
      state.isLoading = false;
      state.addressBook = action.payload;
    },

    // GET INVOICES
    getInvoicesSuccess(state, action) {
      state.isLoading = false;
      state.invoices = action.payload;
    },

    // GET NOTIFICATIONS
    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.notifications = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deleteStaff } = slice.actions;

// ----------------------------------------------------------------------

export function getProfile() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staff/profile');
      dispatch(slice.actions.getProfileSuccess(response.data.profile));
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPosts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staff/posts');
      dispatch(slice.actions.getPostsSuccess(response.data.posts));
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFollowers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staff/social/followers');
      dispatch(slice.actions.getFollowersSuccess(response.data.followers));
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFriends() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staff/social/friends');
      dispatch(slice.actions.getFriendsSuccess(response.data.friends));
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getGallery() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staff/social/gallery');
      dispatch(slice.actions.getGallerySuccess(response.data.gallery));
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
export function getStaffList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staffs');
      dispatch(slice.actions.getStaffListSuccess(response.data.result));
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error.response.data));
    }
  };
}
export const createStaff = (data) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/staffs', data);
      if (response.data.statusCode === 200) {
        dispatch(getStaffList());
      } else {
        console.log('error');
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}
export const editStaff = (data) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/staffs/${data.id}`, data);
      if (response.data.statusCode === 200) {

        // dispatch(slice.actions.getPlayerListSuccess(response.data.result));
      } else {
        console.log('error');
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error.response.data));

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
        console.log('response contract', response);
        callback({ IsError: response.data.IsError })

      }
    } catch (error) {
      console.log(error.response.data, 'error1');
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
      console.log(error, 'error');
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
      console.log(error, 'error');
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
      console.log(error, 'error');
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
      console.log(error, 'error');
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
      console.log(error, 'error');
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
export const getClubMatchContract = (ClubID) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/staff-contracts?ClubID=${ClubID}&IncludeEndedContracts=false&Include=staff`);
      dispatch(slice.actions.getClubContractList(response.data.result))
    }
    catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}

// ----------------------------------------------------------------------

export function getCards() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staff/account/cards');
      dispatch(slice.actions.getCardsSuccess(response.data.cards));
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAddressBook() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staff/account/address-book');
      dispatch(slice.actions.getAddressBookSuccess(response.data.addressBook));
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getInvoices() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staff/account/invoices');
      dispatch(slice.actions.getInvoicesSuccess(response.data.invoices));
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getNotifications() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staff/account/notifications-settings');
      dispatch(slice.actions.getNotificationsSuccess(response.data.notifications));
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getStaffs() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/staff/all');
      dispatch(slice.actions.getStaffsSuccess(response.data.staffs));
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
    }
  };
}
