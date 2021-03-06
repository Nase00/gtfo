import { filter, isEmpty, get } from 'lodash';

import { config } from 'environment';
import socketController from '../controllers/socket';
import validateOauthToken from './validate-oauth-token';
import fetchRoomReservation from './fetch-room-reservation';
import fetchStallOccupancies from './fetch-stall-occupancies';
import consoleController from '../controllers/console';
import { FETCH_ROOM_RESERVATIONS, EMIT_ROOM_PING_RECEIVED } from '../ducks/rooms';
import { EMIT_CLIENT_CONNECTED } from '../ducks/clients';
import { FETCH_STALL_OCCUPANCIES } from '../ducks/stalls';
import { NEW_ROOM_PING } from '../constants';

export default (store) => (next) => (action) => {
  const handlers = {
    [EMIT_CLIENT_CONNECTED]: () => {
      if (!isEmpty(config.oauth)) {
        if (action.oauthResponse === get(config, 'auth.headlessAuthorization')) {
          // Authorized via headless code
          next(action);
        } else {
          // Authorized via Azure SSO, validate token
          validateOauthToken(next, action);
        }
      } else {
        next(action);
      }
    },

    [FETCH_ROOM_RESERVATIONS]() {
      fetchRoomReservation(next, action);
    },

    [FETCH_STALL_OCCUPANCIES]() {
      fetchStallOccupancies(next);
    },

    [EMIT_ROOM_PING_RECEIVED]() {
      const clients = store
        .getState()
        .clientsReducer.get('clients')
        .toJS();

      // Send ping to clients with matching anchor parameter.
      const clientsWithAnchor = filter(clients, { anchor: action.ping.anchor });
      socketController.handle(NEW_ROOM_PING, { ping: action.ping }, clientsWithAnchor);
    }
  };

  try {
    return typeof handlers[action.type] === 'function' ? handlers[action.type]() : next(action);
  } catch (e) {
    consoleController.log(e);
  }
};
