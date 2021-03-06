/* eslint new-cap:0, no-console:0 */

import { UNEXPECTED_SOCKET_ERROR } from '../constants';

/**
 * Middleware function for all open socket communication.
 * Fails gracefully if communication with client fails unexpectedly.
 * @param {string} event Event constant that determines handling client-side.
 * @param {object} payload Payload to send to client.
 * @param {ws} client WebSocket object associated with specific targetted client.
 * @returns {undefined}
 */
export const send = (event, payload = {}, client) => {
  if (client.readyState === 1) {
    client.send(JSON.stringify({ event, payload }));
  } else {
    console.log(UNEXPECTED_SOCKET_ERROR);
  }
};
