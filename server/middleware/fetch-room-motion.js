import moment from 'moment';

import { EMIT_ROOM_MOTION_UPDATE } from '../ducks/rooms';

// TODO fix motionStart not firing

const fetchRoomMotion = (next, action) => {
  const { room, accessories } = action;
  const { motion } = accessories;

  motion.on('motionstart', () => {
    next({
      type: EMIT_ROOM_MOTION_UPDATE,
      room,
      motion: true
    });
  });

  motion.on('motionend', () => {
    next({
      type: EMIT_ROOM_MOTION_UPDATE,
      room,
      motion: false
    });
  });
};

export default fetchRoomMotion;
