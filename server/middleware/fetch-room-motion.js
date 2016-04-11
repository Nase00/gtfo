import moment from 'moment';

import { EMIT_ROOM_MOTION_UPDATE } from '../ducks/rooms';

const fetchRoomMotion = (next, action) => {
  const { room, accessories } = action;
  const { motion } = accessories;

  motion.on('motionstart', () => {
    next({
      type: EMIT_ROOM_MOTION_UPDATE,
      room,
      motion: moment()
    });
  });

  motion.on('data', () => {
    next({
      type: EMIT_ROOM_MOTION_UPDATE,
      room
    });
  });
};

export default fetchRoomMotion;
