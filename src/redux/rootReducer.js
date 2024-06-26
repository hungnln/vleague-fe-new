import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import blogReducer from './slices/blog';
import userReducer from './slices/user';
import playerReducer from './slices/player';
import refereeReducer from './slices/referee';

import staffReducer from './slices/staff';
import clubReducer from './slices/club';
import stadiumReducer from './slices/stadium';
import tournamentReducer from './slices/tournament';
import roundReducer from './slices/round';
import matchReducer from './slices/match';




import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  blog: blogReducer,
  user: userReducer,
  player: playerReducer,
  referee: refereeReducer,
  tournament: tournamentReducer,
  round: roundReducer,
  staff: staffReducer,
  match: matchReducer,

  club: clubReducer,
  stadium: stadiumReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer)
});

export { rootPersistConfig, rootReducer };
