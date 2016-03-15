import socketController from '../controllers/socket';
import fetchRoomReservations from './fetch-room-reservation';
import fetchMockedReservations from './fetch-mocked-reservations';
import fetchRoomTemperature from './fetch-room-temperature';
import fetchRoomMotion from './fetch-room-motion';

import { MOCK_ROOM_RESERVATIONS,
         FETCH_ROOM_RESERVATIONS,
         FETCH_ROOM_TEMPERATURE,
         FETCH_ROOM_MOTION,
         EMIT_ROOM_PING_RECEIVED } from '../ducks/rooms';
import { NEW_ROOM_PING } from '../constants';

export default () => (next) => (action) => {
  switch (action.type) {
    case MOCK_ROOM_RESERVATIONS:
      fetchMockedReservations(next, action);
      break;

    case FETCH_ROOM_RESERVATIONS:
      fetchRoomReservations(next, action);
      break;

    case FETCH_ROOM_TEMPERATURE:
      fetchRoomTemperature(next, action);
      break;

    case FETCH_ROOM_MOTION:
      fetchRoomMotion(next, action);
      break;

    case EMIT_ROOM_PING_RECEIVED:
      socketController.handle(NEW_ROOM_PING, action.ping);
      break;

    default:
      next(action);
      break;
  }
};
