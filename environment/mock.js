/**
 * This mock mock environment object is used in place
 * of trying to read JSON files while running tests.
 */

import { SERVER_PORT } from '../server/config';

export default {
  config: {
    public: {
      enableMotion: false,
      enableStalls: true
    },
    reservations: {
      hostname: 'localhost',
      port: SERVER_PORT,
      path: '/mocks/meetingRoom/all'
    },
    stalls: {
      host: `http://localhost:${SERVER_PORT}`,
      path: '/mocks/stalls'
    }
  },
  devices: [],
  markers: [],
  coordinates: {}
};
