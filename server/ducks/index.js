import { combineReducers } from 'redux';

import clientsReducer from './clients';
import roomsReducer from './rooms';
import stallsReducer from './stalls';
import markersReducer from './markers';

export default combineReducers({
  clientsReducer,
  roomsReducer,
  stallsReducer,
  markersReducer
});
