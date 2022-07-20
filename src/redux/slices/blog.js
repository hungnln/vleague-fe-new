import { createSlice } from '@reduxjs/toolkit';
import { filter } from 'lodash';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  posts: [],
  post: null,
  recentPosts: [],
  hasMore: true,
  index: 0,
  step: 1,
};

const slice = createSlice({
  name: 'news',
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

    // GET POSTS
    getPostsSuccess(state, action) {
      state.isLoading = false;
      const newPosts = []
      if (state.posts.length !== 0) {
        action.payload.forEach((post, index) => {
          if (!state.posts.find(statePost => statePost.id === post.id)) {
            newPosts = [...newPosts, post]
          }
        })
        state.posts = [].concat(state.posts, newPosts)
      }
      else {
        state.posts = action.payload

      }


    },
    addPost(state, action) {
      state.isLoading = false;
      state.posts = [...state.posts, action.payload]
    },
    editPost(state, action) {
      state.isLoading = false;
      const newPost = state.posts.map(post => {
        if (Number(post.id) === Number(action.payload.id)) {
          return action.payload
        }
        return post
      })
      state.posts = newPost
    },
    deletePost(state, action) {
      const deletePost = filter(state.posts, (post) => post.id !== action.payload);
      state.posts = deletePost;
    },

    // GET POST INFINITE
    getPostsInitial(state, action) {
      state.isLoading = false;
      state.posts = [...state.post, action.payload];
    },

    getMorePosts(state) {
      const setIndex = state.step + 1;
      state.index = setIndex;
    },

    noHasMore(state) {
      state.hasMore = false;
    },

    // GET POST
    getPostSuccess(state, action) {
      state.isLoading = false;
      state.post = action.payload;
    },

    // GET RECENT POST
    getRecentPostsSuccess(state, action) {
      state.isLoading = false;
      state.recentPosts = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { getMorePosts } = slice.actions;

// ----------------------------------------------------------------------

export function getAllPosts(PageNumber) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/news?Include=clubs,players&PageNumber=${PageNumber || 1}`);
      const results = response.data.result.length;
      const { totalCount } = response.data.pagination;

      // dispatch(slice.actions.getPostsInitial(response.data.result));

      if (results >= totalCount) {
        dispatch(slice.actions.noHasMore());
      }
      dispatch(slice.actions.getPostsSuccess(response.data.result));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function createPost(values, callback) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/news', values);
      if (response.data.statusCode === 200) {
        const { id } = response.data.result
        const responsePost = await axios.get(`/api/news/${id}?Include=players,clubs`);
        dispatch(slice.actions.addPost(responsePost.data.result));
        callback({ IsError: response.data.IsError })
      }

    } catch (error) {
      dispatch(slice.actions.hasError(error));
      // console.log(error);
      callback(error.response.data)

    }
  };
}
export function editPost(values, callback) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/news/${values.id}`, values);
      if (response.data.statusCode === 200) {
        const responsePost = await axios.get(`/api/news/${values.id}?Include=players,clubs`);
        dispatch(slice.actions.editPost(responsePost.data.result))
        callback({ IsError: response.data.IsError })
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      callback(error.response.data)

    }
  };
}
export function deletePost(id) {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/news/${id}`);
      dispatch(slice.actions.deletePost(id))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

// ----------------------------------------------------------------------

export function getPostsInitial(step) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/news?Include=clubs,players&PageNumber=${step || 1}`);
      const results = response.data.result.length;
      const { totalCount } = response.data.pagination;

      dispatch(slice.actions.getPostsInitial(response.data.result));

      if (results >= totalCount) {
        dispatch(slice.actions.noHasMore());
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// // ----------------------------------------------------------------------

export function getPost(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/news/${id}?Include=players,clubs`);
      dispatch(slice.actions.getPostSuccess(response.data.result));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// // ----------------------------------------------------------------------

// export function getRecentPosts(id) {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get(`/api/news/${id}?Include=author`);
//       dispatch(slice.actions.getRecentPostsSuccess(response.data.recentPosts));
//     } catch (error) {
//       console.error(error);
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }
