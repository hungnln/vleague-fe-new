import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  myProfile: null,
  isOpenModal: false,
  posts: [],
  rounds: [],
  roundList: [],
  followers: [],
  friends: [],
  gallery: [],
  cards: null,
  addressBook: [],
  invoices: [],
  notifications: null,
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
    getRoundsSuccess(state, action) {
      state.isLoading = false;
      state.rounds = action.payload;
    },

    // DELETE USERS
    deleteRound(state, action) {
      const deleteRound = filter(state.roundList, (round) => round.id !== action.payload);
      state.roundList = deleteRound;
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
    getRoundListSuccess(state, action) {
      state.isLoading = false;
      state.roundList = action.payload;
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
    ,
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
      // state.selectedEventId = null;
      // state.selectedRange = null;
    }
  },

});

// Reducer
export default slice.reducer;
// Actions
export const { onToggleFollow, deleteRound, openModal, closeModal } = slice.actions;

// ----------------------------------------------------------------------

export function getProfile() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/round/profile');
      dispatch(slice.actions.getProfileSuccess(response.data.profile));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPosts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/round/posts');
      dispatch(slice.actions.getPostsSuccess(response.data.posts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFollowers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/round/social/followers');
      dispatch(slice.actions.getFollowersSuccess(response.data.followers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getFriends() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/round/social/friends');
      dispatch(slice.actions.getFriendsSuccess(response.data.friends));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getGallery() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/round/social/gallery');
      dispatch(slice.actions.getGallerySuccess(response.data.gallery));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

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

// ----------------------------------------------------------------------

export function getCards() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/round/account/cards');
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
      const response = await axios.get('/api/round/account/address-book');
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
      const response = await axios.get('/api/round/account/invoices');
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
      const response = await axios.get('/api/round/account/notifications-settings');
      dispatch(slice.actions.getNotificationsSuccess(response.data.notifications));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getRounds() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/round/all');
      dispatch(slice.actions.getRoundsSuccess(response.data.rounds));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
