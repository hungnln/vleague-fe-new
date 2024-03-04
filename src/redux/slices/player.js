import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  playerList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  contractList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  },
  playerDetail: null,
  currentContract: {},
  homeContractList: [],
  awayContractList: [],
  clubContractList: {
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 0,
      totalCount: 0,
      totalPage: 0
    }
  }
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
    addPlayer(state, action) {
      state.isLoading = false;
      state.error = false;
      const { data, pagination } = state.playerList
      const newTotalCount = pagination.totalCount + 1 || 1
      const newData = [...data, action.payload]
      const newPlayerList = {
        data: newData,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      };
      state.playerList = newPlayerList;
    },
    editPlayer(state, action) {
      state.isLoading = false;
      const newPlayerList = state.playerList.data.map(player => {
        if (player.id === action.payload.id) {
          return action.payload
        }
        return player
      })
      state.playerList.data = newPlayerList
    },
    getPlayerDetail(state, action) {
      state.isLoading = false;
      state.playerDetail = action.payload;
    },

    // DELETE USERS
    deletePlayer(state, action) {
      const { data, pagination } = state.playerList;
      const newTotalCount = pagination.totalCount - 1 || 0;
      const deletePlayer = filter(data, (player) => player.id !== action.payload);
      state.playerList = {
        data: deletePlayer,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      }
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
      state.error = false;
      const { data, pagination } = state.contractList
      const newTotalCount = pagination.totalCount + 1 || 1
      const newData = [...data, action.payload]
      const newContractList = {
        data: newData,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      };
      state.contractList = newContractList;
    },
    editContract(state, action) {
      state.isLoading = false;
      const newContractList = state.contractList.data.map(contract => {
        if (contract.id === action.payload.id) {
          return action.payload
        }
        return contract
      })
      state.contractList.data = newContractList
    },
    deleteContract(state, action) {
      const { data, pagination } = state.contractList;
      const newTotalCount = pagination.totalCount - 1 || 0;
      const deleteContract = filter(data, (contract) => contract.id !== action.payload);
      state.contractList = {
        data: deleteContract,
        pagination: {
          ...pagination,
          totalCount: newTotalCount
        }
      }
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
    getPlayerListSuccess(state, action) {
      state.isLoading = false;
      state.playerList = action.payload;
    },


  }
});

// Reducer
export default slice.reducer;

// Actions
export const { onToggleFollow, deletePlayer } = slice.actions;

// ----------------------------------------------------------------------
export function getPlayerList(pageIndex, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/players?pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getPlayerListSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export const getPlayerDetail = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/players/${id}`);
      dispatch(slice.actions.getPlayerDetail(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const createPlayer = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/players', data);
      dispatch(slice.actions.addPlayer(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      callback(error.response.data)
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const editPlayer = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/players/${data.id}`, data);
      dispatch(slice.actions.editPlayer(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      callback(error.response.data)
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const removePlayer = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/players/${id}`);
      dispatch(slice.actions.deletePlayer(id))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
export const createContract = (data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/player-contracts', data);
      dispatch(slice.actions.addContract(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));
      callback(error.response.data)
    }
  }
}
export const editContract = (id, data, callback) => {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/player-contracts/${id}`, data);
      dispatch(slice.actions.editContract(response.data.data));
      callback({ status: response.data.status, message: response.data.message })
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));
      callback(error.response.data)
    }
  }
}
export const removeContract = (id) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/player-contracts/${id}`);
      dispatch(getContractList('', 'player, club'))

    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}
export const getContract = (id, include) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/player-contracts/${id}?Include=${include}`);
      dispatch(slice.actions.getCurrentContract(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}
export const getMatchPlayerContract = (HomeClubID, AwayClub) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const homeResponse = await axios.get(`/player-contracts?clubId=${HomeClubID}&includeEndedContracts=false&Include=player`);
      const awayResponse = await axios.get(`/player-contracts?clubId=${AwayClub}&includeEndedContracts=false&Include=player`);
      dispatch(slice.actions.getHomeContract(homeResponse.data.data))
      dispatch(slice.actions.getAwayContract(awayResponse.data.data))
    }
    catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }

}
export const getClubMatchContract = (clubId, matchDate, pageIndex, pageSize) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/player-contracts?clubId=${clubId}&includeEndedContracts=false&Include=player&matchDate=${matchDate}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getClubContractList(response.data.data))
    }
    catch (error) {
      dispatch(slice.actions.hasError(error.response.data));

    }
  }
}
export const getContractList = (id, pageIndex, pageSize) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/player-contracts?playerId=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
      dispatch(slice.actions.getContractList(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

