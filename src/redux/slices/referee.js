import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  refereeList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  refereeDetail: null,
};

const slice = createSlice({
  name: 'referee',
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
    getRefereesSuccess(state, action) {
      state.isLoading = false;
      state.referees = action.payload;
    },
    addReferee(state, action) {
      state.isLoading = false;
      state.error = false;
      const { data, pagination } = state.refereeList
      const newTotalCount = pagination.totalCount + 1 || 1
      const newData = [...data, action.payload]
      const newRefereeList = {
        data: newData,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      };
      state.refereeList = newRefereeList;
    },
    editReferee(state, action) {
      state.isLoading = false;
      const newRefereeList = state.refereeList.data.map(referee => {
        if (referee.id === action.payload.id) {
          return action.payload
        }
        return referee
      })
      state.refereeList.data = newRefereeList
    },
    getRefereeDetail(state, action) {
      state.isLoading = false;
      state.refereeDetail = action.payload;
    },

    // DELETE USERS
    deleteReferee(state, action) {
      const { data, pagination } = state.refereeList;
      const newTotalCount = pagination.totalCount - 1 || 0;
      const deleteReferee = filter(data, (referee) => referee.id !== action.payload);
      state.refereeList = {
        data: deleteReferee,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      }
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
    getRefereeListSuccess(state, action) {
      state.isLoading = false;
      state.refereeList = action.payload;
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
export const { onToggleFollow, deleteReferee } = slice.actions;

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
export function getRefereeList(pageIndex, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/referees?pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getRefereeListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const getRefereeDetail = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/referees/${id}`);
      dispatch(slice.actions.getRefereeDetail(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const createReferee = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/referees', data);
      dispatch(slice.actions.addReferee(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      callback(error.response.data)
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const editReferee = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/referees/${data.id}`, data);
      dispatch(slice.actions.editReferee(response.data.data));
      callback({ status: response.data.status, message: response.data.message })

    } catch (error) {
      callback(error.response.data)
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const removeReferee = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/referees/${id}`);
      dispatch(slice.actions.deleteReferee(id))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}


