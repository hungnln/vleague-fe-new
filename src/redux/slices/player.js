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
  players: [],
  playerList: [],
  followers: [],
  friends: [],
  gallery: [],
  cards: null,
  addressBook: [],
  invoices: [],
  notifications: null,
  contractList: [],
  playerContracts: [],
  playerDetail: null,
  currentContract: {},
};

const slice = createSlice({
  name: 'player',
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
    getPlayersSuccess(state, action) {
      state.isLoading = false;
      state.players = action.payload;
    },
    addPlayer(state, action) {
      state.isLoading = false;
      const newPlayerList = [...state.playerList, action.payload]
      state.playerList = newPlayerList
    },
    editPlayer(state, action) {
      state.isLoading = false;
      const newPlayerList = state.playerList.map(player => {
        if (Number(player.id) === Number(action.payload.id)) {
          return action.payload
        }
        return player
      })
      state.playerList = newPlayerList
    },
    getPlayerDetail(state, action) {
      state.isLoading = false;
      state.playerDetail = action.payload;
    },

    // DELETE USERS
    deletePlayer(state, action) {
      const deletePlayer = filter(state.playerList, (player) => player.id !== action.payload);
      state.playerList = deletePlayer;
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
    deleteContract(state, action) {
      const deleteContract = filter(state.contractList, (contract) => contract.id !== action.payload);
      state.contractList = deleteContract;
    },

    getCurrentContract(state, action) {
      state.isLoading = false;
      state.currentContract = action.payload;
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
    getPlayerListSuccess(state, action) {
      state.isLoading = false;
      state.playerList = action.payload;
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
export const { onToggleFollow, deletePlayer } = slice.actions;

// ----------------------------------------------------------------------

export function getProfile() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/player/profile');
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
      const response = await axios.get('/api/player/posts');
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
      const response = await axios.get('/api/player/social/followers');
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
      const response = await axios.get('/api/player/social/friends');
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
      const response = await axios.get('/api/player/social/gallery');
      dispatch(slice.actions.getGallerySuccess(response.data.gallery));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
export function getPlayerList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/players');
      dispatch(slice.actions.getPlayerListSuccess(response.data.result));
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const getPlayerDetail = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/players/${id}`);
      dispatch(slice.actions.getPlayerDetail(response.data.result))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const createPlayer = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/players', data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.addPlayer(response.data.result));
        callback({ IsError: response.data.IsError })

      }
    } catch (error) {
      console.log(error, 'error');
      callback(error.response.data)


      dispatch(slice.actions.hasError(error));
    }
  }
}
export const editPlayer = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/players/${data.id}`, data);
      if (response.data.statusCode === 200) {
        dispatch(slice.actions.editPlayer(response.data.result));
        callback({ IsError: response.data.IsError })
      }
    } catch (error) {
      console.log(error, 'error');
      callback(error.response.data)
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const removePlayer = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/players/${id}`);
      dispatch(slice.actions.deletePlayer(id))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}





export const createContract = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/player-contracts', data);
      if (response.data.statusCode === 200) {
        const contractResponse = await axios.get(`/api/player-contracts/${response.data.result.id}?Include=player, club`);
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
      const response = await axios.put(`/api/player-contracts/${id}`, data);
      if (response.data.statusCode === 200) {
        const contractResponse = await axios.get(`/api/player-contracts/${response.data.result.id}?Include=player, club`);
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
export const removeContract = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/player-contracts/${id}`);
      dispatch(getContractList('', 'player, club'))

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
      const response = await axios.get(`/api/player-contracts/${id}?Include=${include}`);
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
      const response = await axios.get(`/api/player-contracts?PlayerID=${id}&Include=${include}`);
      dispatch(slice.actions.getContractList(response.data.result))
    } catch (error) {
      console.log(error, 'error');
      dispatch(slice.actions.hasError(error));
    }
  }
}

// ----------------------------------------------------------------------

// export function getCards() {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/player/account/cards');
//       dispatch(slice.actions.getCardsSuccess(response.data.cards));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// // ----------------------------------------------------------------------

// export function getAddressBook() {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/player/account/address-book');
//       dispatch(slice.actions.getAddressBookSuccess(response.data.addressBook));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// // ----------------------------------------------------------------------

// export function getInvoices() {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/player/account/invoices');
//       dispatch(slice.actions.getInvoicesSuccess(response.data.invoices));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// // ----------------------------------------------------------------------

// export function getNotifications() {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/player/account/notifications-settings');
//       dispatch(slice.actions.getNotificationsSuccess(response.data.notifications));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// // ----------------------------------------------------------------------

// export function getPlayers() {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get('/api/player/all');
//       dispatch(slice.actions.getPlayersSuccess(response.data.players));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }
