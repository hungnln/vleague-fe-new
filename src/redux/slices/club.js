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
  clubs: [],
  clubList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  followers: [],
  friends: [],
  gallery: [],
  cards: null,
  addressBook: [],
  invoices: [],
  notifications: null,
  clubDetail: {},
  staffContractList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  playerContractList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },

};

const slice = createSlice({
  name: 'club',
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

    // ADD CLUB
    addClub(state, action) {
      state.isLoading = false;
      state.error = false;
      const { data, pagination } = state.clubList
      const newTotalCount = pagination.totalCount + 1 || 1
      const newData = [...data, action.payload]
      const newClubList = {
        data: newData,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      };
      state.clubList = newClubList;

    },
    // UPDATE CLUB
    updateClub(state, action) {
      state.isLoading = false;
      state.error = false;
      const newClubList = state.clubList.data.map(club => {
        if (club.id === action.payload.id) {
          return action.payload
        }
        return club
      })
      state.clubList.data = newClubList
    },

    // DELETE CLUB
    deleteClub(state, action) {
      const { data, pagination } = state.clubList;
      const newTotalCount = pagination.totalCount - 1 || 0;
      const deleteClub = filter(data, (Club) => Club.id !== action.payload);
      state.clubList = {
        data: deleteClub,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      }
    },
    getClubDetail(state, action) {
      state.isLoading = false;
      state.clubDetail = action.payload;
    },
    getStaffContractList(state, action) {
      state.error = false;
      state.isLoading = false;
      state.staffContractList = action.payload;
    },
    getPlayerContractList(state, action) {
      state.error = false;
      state.isLoading = false;
      state.playerContractList = action.payload;
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
    getClubListSuccess(state, action) {
      state.isLoading = false;
      state.clubList = action.payload;
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
export const { onToggleFollow, deleteClub } = slice.actions;

// ----------------------------------------------------------------------
export function getClubList(pageIndex, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/clubs?Include=stadium&pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getClubListSuccess(response.data.data));
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createClub = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/clubs', data);
      dispatch(slice.actions.addClub(response.data.data))
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)
    }
  }
}
export const editClub = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/clubs/${data.id}`, data);
      dispatch(slice.actions.updateClub(response.data.data))
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)
    }
  }
}
export const removeClub = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/clubs/${id}`);
      dispatch(slice.actions.deleteClub(id))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const getClubDetail = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/clubs/${id}`);
      dispatch(slice.actions.getClubDetail(response.data.data))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const getStaffContractList = (id, pageIndex, pageSize) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/staff-contracts?clubId=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getStaffContractList(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const getPlayerContractList = (id, pageIndex, pageSize) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/player-contracts?clubId=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getPlayerContractList(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

// ----------------------------------------------------------------------

export function getCards() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/club/account/cards');
      dispatch(slice.actions.getCardsSuccess(response.data.cards));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAddressBook() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/club/account/address-book');
      dispatch(slice.actions.getAddressBookSuccess(response.data.addressBook));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getInvoices() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/club/account/invoices');
      dispatch(slice.actions.getInvoicesSuccess(response.data.invoices));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getNotifications() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/club/account/notifications-settings');
      dispatch(slice.actions.getNotificationsSuccess(response.data.notifications));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getClubs() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/club/all');
      dispatch(slice.actions.getClubsSuccess(response.data.clubs));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
