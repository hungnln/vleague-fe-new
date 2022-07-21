import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  playerList: [],
  contractList: [],
  playerContracts: [],
  playerDetail: null,
  currentContract: {},
  homeContractList: [],
  awayContractList: [],
  clubContractList: []
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
export function getPlayerList() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/players');
      dispatch(slice.actions.getPlayerListSuccess(response.data.result));
    } catch (error) {
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
export const getClubMatchContract = (ClubID, start) => {
  return async dispatch => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/player-contracts?ClubID=${ClubID}&IncludeEndedContracts=false&Include=player&Start=${start}`);
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
      dispatch(slice.actions.hasError(error));
    }
  }
}

