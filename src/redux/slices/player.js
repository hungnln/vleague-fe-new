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
  homeContractList: [],
  awayContractList: [],
  // clubContractList: []
  clubContractList: [
    {
      id: 6,
      playerID: 30,
      player: {
        id: 30,
        name: 'Dương Văn Lợi',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/37fb8771-c27a-4672-ae17-80ef400fd60b',
        dateOfBirth: '2004-12-01T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 1,
      salary: 20000000,
      start: '2022-06-21T16:05:01.061',
      end: '2023-06-21T16:05:07.589',
      description: 'demo'
    },
    {
      id: 7,
      playerID: 31,
      player: {
        id: 31,
        name: 'Lê Văn Sơn',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/f641d379-a09c-4631-9abf-7fdc894ca2e1',
        dateOfBirth: '1996-12-19T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 2,
      salary: 20000000,
      start: '2022-06-21T16:06:06.2',
      end: '2023-06-21T16:06:21.857',
      description: 'demo'
    },
    {
      id: 8,
      playerID: 32,
      player: {
        id: 32,
        name: 'Kim Dongsu',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/a5cef09f-fa2b-4987-9109-50bee49fe854',
        dateOfBirth: '1995-03-20T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 3,
      salary: 20000000,
      start: '2022-06-21T16:06:56.377',
      end: '2023-06-21T16:06:58.196',
      description: 'demo'
    },
    {
      id: 9,
      playerID: 34,
      player: {
        id: 34,
        name: 'Lương Xuân Trường',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/7f1456ad-e664-4e22-a1cc-ee7e1f9dad79',
        dateOfBirth: '1995-04-27T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 6,
      salary: 20000000,
      start: '2022-06-21T16:07:48.474',
      end: '2023-06-21T16:07:50.182',
      description: '1'
    },
    {
      id: 10,
      playerID: 35,
      player: {
        id: 35,
        name: 'Nguyễn Phong Hồng Duy',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/e7553af6-48c3-484f-ac40-ebf41f0a9cbc',
        dateOfBirth: '1996-06-12T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 7,
      salary: 20000000,
      start: '2022-06-21T16:08:17.264',
      end: '2023-06-21T16:08:19.198',
      description: '1'
    },
    {
      id: 11,
      playerID: 36,
      player: {
        id: 36,
        name: 'Trần Minh Vương',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/f11cdd3d-a2ed-4c79-a306-65e3916c55f3',
        dateOfBirth: '1995-03-27T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 8,
      salary: 20000000,
      start: '2022-06-21T16:08:48.178',
      end: '2023-06-21T16:08:49.769',
      description: '1'
    },
    {
      id: 13,
      playerID: 38,
      player: {
        id: 38,
        name: 'Nguyễn Công Phượng',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/1166548c-8780-4cbb-b4c8-08b8f1e54fa0',
        dateOfBirth: '1995-01-20T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 10,
      salary: 20000000,
      start: '2022-06-21T16:09:58.559',
      end: '2023-06-21T16:10:00.042',
      description: '1'
    },
    {
      id: 14,
      playerID: 39,
      player: {
        id: 39,
        name: 'Nguyễn Tuấn Anh',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/5152c262-a952-4014-aea4-8874280362bf',
        dateOfBirth: '1995-05-15T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 11,
      salary: 20000000,
      start: '2022-06-21T16:10:23.702',
      end: '2023-06-21T16:10:25.763',
      description: '1'
    },
    {
      id: 15,
      playerID: 40,
      player: {
        id: 40,
        name: 'Tiêu Ê Xal',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/1eb50819-c019-48b9-8ec5-c6e7d392087b',
        dateOfBirth: '2000-08-13T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 12,
      salary: 200000000,
      start: '2022-06-21T16:10:54.94',
      end: '2023-06-21T16:10:56.277',
      description: '1'
    },
    {
      id: 16,
      playerID: 41,
      player: {
        id: 41,
        name: 'Nguyễn Hữu Tuấn',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/cafd2ba4-febb-4334-9cfd-88ecfba40a52',
        dateOfBirth: '1992-05-05T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 15,
      salary: 20000000,
      start: '2022-06-21T16:11:20.581',
      end: '2023-06-21T16:11:22.087',
      description: '1'
    },
    {
      id: 17,
      playerID: 42,
      player: {
        id: 42,
        name: 'Vũ Văn Thanh',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/77609db3-6d57-48e9-8fc0-abef1a43a58c',
        dateOfBirth: '1996-04-13T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 17,
      salary: 20000000,
      start: '2022-06-21T16:12:02.656',
      end: '2023-06-21T16:12:17.748',
      description: '1'
    },
    {
      id: 18,
      playerID: 43,
      player: {
        id: 43,
        name: 'Trần Bảo Toàn',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/e3e9527e-0a9e-4820-b636-c802df3b5577',
        dateOfBirth: '2000-07-13T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 20,
      salary: 20000000,
      start: '2022-06-21T16:12:46.106',
      end: '2023-06-21T16:12:48.129',
      description: '1'
    },
    {
      id: 19,
      playerID: 44,
      player: {
        id: 44,
        name: 'Lê Huy Kiệt',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/f39e6091-1464-4438-8a89-9a13844c0462',
        dateOfBirth: '2003-10-19T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 21,
      salary: 20000000,
      start: '2022-06-21T16:14:37.686',
      end: '2023-06-21T16:14:39.422',
      description: '1'
    },
    {
      id: 20,
      playerID: 45,
      player: {
        id: 45,
        name: 'Nguyễn Nhĩ Khang',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/f1fffa6f-7099-425c-a5a1-df4f6f26d975',
        dateOfBirth: '2001-02-15T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 22,
      salary: 20000000,
      start: '2022-06-21T16:16:11.989',
      end: '2023-06-21T16:16:13.488',
      description: '1'
    },
    {
      id: 21,
      playerID: 46,
      player: {
        id: 46,
        name: 'Nguyễn Thanh Nhân',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/6198bcf8-5e6d-4bb2-9b30-923e9ccf7bf7',
        dateOfBirth: '2000-10-24T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 23,
      salary: 20000000,
      start: '2022-06-21T16:16:33.873',
      end: '2023-06-21T16:16:35.237',
      description: '121'
    },
    {
      id: 22,
      playerID: 47,
      player: {
        id: 47,
        name: 'Nguyễn Đức Việt',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/18991833-646a-4b4b-a559-7dcdcc3cc574',
        dateOfBirth: '2003-12-31T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 24,
      salary: 20000000,
      start: '2022-06-21T16:16:57.533',
      end: '2023-06-21T16:16:58.919',
      description: '1'
    },
    {
      id: 23,
      playerID: 48,
      player: {
        id: 48,
        name: 'Huỳnh Tuấn Linh',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/f75f950d-59af-49d9-a915-811aaf12e521',
        dateOfBirth: '1991-04-11T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 26,
      salary: 20000000,
      start: '2022-06-21T16:17:26.493',
      end: '2023-06-21T16:17:37.72',
      description: '1'
    },
    {
      id: 24,
      playerID: 49,
      player: {
        id: 49,
        name: 'Nguyễn Văn Triệu',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/d3298d2b-22a2-4f51-9d1e-c1ffbc9c6de7',
        dateOfBirth: '2003-01-16T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 27,
      salary: 20000000,
      start: '2022-06-21T16:18:02.445',
      end: '2023-06-21T16:18:03.89',
      description: '1'
    },
    {
      id: 25,
      playerID: 50,
      player: {
        id: 50,
        name: 'Nguyễn Văn Việt',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/161df716-c734-4ad6-b664-591e3f188b3e',
        dateOfBirth: '1989-01-16T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 28,
      salary: 20000000,
      start: '2022-06-21T16:18:46.359',
      end: '2023-06-21T16:18:47.828',
      description: '1'
    },
    {
      id: 26,
      playerID: 51,
      player: {
        id: 51,
        name: 'Washington Brandão Dos Santos',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/c95d268d-a09c-4259-be61-45cc91c9c273',
        dateOfBirth: '1990-08-17T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 30,
      salary: 20000000,
      start: '2022-06-21T16:19:04.844',
      end: '2023-06-21T16:19:06.208',
      description: '1'
    },
    {
      id: 27,
      playerID: 52,
      player: {
        id: 52,
        name: 'Lê Hữu Phước',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/401ad076-1828-4618-b6a7-c71df3dfe0d4',
        dateOfBirth: '2001-05-06T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 34,
      salary: 20000000,
      start: '2022-06-21T16:19:26.539',
      end: '2023-06-21T16:19:27.879',
      description: '1'
    },
    {
      id: 28,
      playerID: 53,
      player: {
        id: 53,
        name: 'Cao Hoàng Tú',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/fc4efecb-9130-430b-93af-43d8071a45ad',
        dateOfBirth: '2001-09-05T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 47,
      salary: 20000000,
      start: '2022-06-21T16:20:39.968',
      end: '2023-06-21T16:20:41.598',
      description: '1'
    },
    {
      id: 29,
      playerID: 54,
      player: {
        id: 54,
        name: 'Võ Đình Lâm',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/1b6497ca-e8bf-4927-afe8-f63732d67995',
        dateOfBirth: '2000-01-09T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 60,
      salary: 20000000,
      start: '2022-06-21T16:20:57.163',
      end: '2023-06-21T16:20:59.238',
      description: '1'
    },
    {
      id: 30,
      playerID: 55,
      player: {
        id: 55,
        name: 'Lê Đức Lương',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/805abbea-c098-4d8c-8b72-741b49ea4e6a',
        dateOfBirth: '1994-08-17T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 66,
      salary: 20000000,
      start: '2022-06-21T16:21:19.435',
      end: '2023-06-21T16:21:20.956',
      description: '1'
    },
    {
      id: 31,
      playerID: 56,
      player: {
        id: 56,
        name: 'Huỳnh Tiến Đạt',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/871c350b-d4f9-4cce-b21d-ed8bb149f3bc',
        dateOfBirth: '2000-01-25T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 77,
      salary: 20000000,
      start: '2022-06-21T16:21:37.213',
      end: '2023-06-21T16:21:39.138',
      description: '1'
    },
    {
      id: 32,
      playerID: 57,
      player: {
        id: 57,
        name: 'A Hoàng',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/c01a9f11-7a32-449b-9d6a-d17d1b77c3e4',
        dateOfBirth: '1995-07-30T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 82,
      salary: 20000000,
      start: '2022-06-21T16:21:55.709',
      end: '2023-06-21T16:21:57.186',
      description: '1'
    },
    {
      id: 33,
      playerID: 58,
      player: {
        id: 58,
        name: 'Barbosa Teixeira Mauricio',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/38ffdeb1-d4a4-4386-bd61-5c7fec40adab',
        dateOfBirth: '1994-12-07T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 94,
      salary: 200000000,
      start: '2022-06-21T16:22:13.27',
      end: '2023-06-21T16:22:14.808',
      description: '1'
    },
    {
      id: 34,
      playerID: 59,
      player: {
        id: 59,
        name: 'Jefferson Silva dos Santos',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/043ec704-ff47-448e-acff-ce3d85548010',
        dateOfBirth: '1995-05-09T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 95,
      salary: 20000000,
      start: '2022-06-21T16:22:31.023',
      end: '2023-06-21T16:22:32.719',
      description: '1'
    },
    {
      id: 35,
      playerID: 60,
      player: {
        id: 60,
        name: 'Lê Văn Trường',
        imageURL: 'https://noobercong.blob.core.windows.net/dms/cc3ac993-f8c1-4e75-82c4-fbfc730a0205',
        dateOfBirth: '1995-12-20T17:00:00'
      },
      clubID: 10,
      club: null,
      number: 99,
      salary: 20000000,
      start: '2022-06-21T16:22:51.821',
      end: '2023-06-21T16:22:53.332',
      description: '1'
    }
  ]

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
    getClubContractList(state, action) {
      state.isLoading = false;
      state.clubContractList = action.payload
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
    getHomeContract(state, action) {
      state.isLoading = false;
      state.homeContractList = action.payload;
    },
    getAwayContract(state, action) {
      state.isLoading = false;
      state.awayContractList = action.payload;
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
export const getMatchPlayerContract = (HomeClubID, AwayClub) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const homeResponse = await axios.get(`/api/player-contracts?ClubID=${HomeClubID}&IncludeEndedContracts=false&Include=player`);
      const awayResponse = await axios.get(`/api/player-contracts?ClubID=${AwayClub}&IncludeEndedContracts=false&Include=player`);
      dispatch(slice.actions.getHomeContract(homeResponse.data.result))
      dispatch(slice.actions.getAwayContract(awayResponse.data.result))
    }
    catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }

}
export const getClubMatchContract = (ClubID) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/player-contracts?ClubID=${ClubID}&IncludeEndedContracts=false&Include=player`);
      dispatch(slice.actions.getClubContractList(response.data.result))
    }
    catch (error) {
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

