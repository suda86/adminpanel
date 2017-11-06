import { combineReducers } from 'redux';
import auth_reducer from './auth_reducer';
import users_reducer from './users_reducer';
import events_reducer from './events_reducer';
import venues_reducer from './venues_reducer';
import error_reducer from './error_reducer';

export default combineReducers({
  authenticated: auth_reducer,
  users: users_reducer,
  events: events_reducer,
  venues: venues_reducer,
  error: error_reducer
});
