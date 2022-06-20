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
  matches: [],
  matchList: [],
  followers: [],
  friends: [],
  gallery: [],
  cards: null,
  addressBook: [],
  invoices: [],
  notifications: null,
  currentMatch: {}
};

const slice = createSlice({
  name: 'match',
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
    getMatchesSuccess(state, action) {
      state.isLoading = false;
      state.matches = action.payload;
    },

    // DELETE USERS
    deleteMatch(state, action) {
      const deleteMatch = filter(state.matchList, (match) => match.id !== action.payload);
      state.matchList = deleteMatch;
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
    getMatchListSuccess(state, action) {
      state.isLoading = false;
      state.matchList = action.payload;
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
    addMatch(state, action) {
      state.isLoading = false;
      const newMatchList = [...state.matchList, action.payload]
      state.matchList = newMatchList
    },
    editMatch(state, action) {
      state.isLoading = false;
      const newMatchList = state.matchList.map(match => {
        if (Number(match.id) === Number(action.payload.id)) {
          return action.payload
        }
        return match
      })
      state.matchList = newMatchList
    },
    getMatchDetail(state, action) {
      state.isLoading = false;
      state.currentMatch = action.payload
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
export const { onToggleFollow, deleteMatch, openModal, closeModal } = slice.actions;

// ----------------------------------------------------------------------

export function getProfile() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/match/profile');
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
      const response = await axios.get('/api/match/posts');
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
      const response = await axios.get('/api/match/social/followers');
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
      const response = await axios.get('/api/match/social/friends');
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
      const response = await axios.get('/api/match/social/gallery');
      dispatch(slice.actions.getGallerySuccess(response.data.gallery));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
export function getMatchList(tournamentId,roundId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/matches?TournamentID=${tournamentId}&RoundID=${roundId}`);
      dispatch(slice.actions.getMatchListSuccess(response.data.result));
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const createMatch = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/matches', data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.addMatch(response.data.result));
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
export const editMatch = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/matches/${data.id}`, data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.editMatch(response.data.result));
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
export const getMatchDetail = (matchId) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/matches/${matchId}`);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.getMatchDetail(response.data.result));
        console.log('response match', response);
      }
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const removeMatch = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/matches/${id}`);
      dispatch(slice.actions.deleteMatch(id))
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
      const response = await axios.get('/api/match/account/cards');
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
      const response = await axios.get('/api/match/account/address-book');
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
      const response = await axios.get('/api/match/account/invoices');
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
      const response = await axios.get('/api/match/account/notifications-settings');
      dispatch(slice.actions.getNotificationsSuccess(response.data.notifications));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getMatches() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/match/all');
      dispatch(slice.actions.getMatchesSuccess(response.data.matches));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
