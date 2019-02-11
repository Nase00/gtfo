import { isEmpty } from 'lodash';
import colors from 'colors/safe';

import oauthController from '../controllers/oauth';
import { EMIT_RESERVATIONS_UPDATE } from '../ducks/rooms';
import { config } from '../../environment';
import { formatReservations, logFetchReservationsAPIError, httpRequest } from '../utils';
import store from '../store';

const fetchRoomReservation = async (next) => {
  const data = await oauthController.fetchAccessTokenFromRefreshToken();
  const options = {
    method: 'GET',
    host: config.reservations.hostname,
    path: config.reservations.path,
    port: config.reservations.port,
    ...(!isEmpty(config.oauth) ? { headers: { Authorization: `Bearer ${data.access_token}` } } : {})
  };

  try {
    const { rawData, statusCode } = await httpRequest({ options });

    if (statusCode !== 200) {
      throw new Error(logFetchReservationsAPIError({ code: statusCode }));
    }

    const parsedData = JSON.parse(rawData.toString('utf8'));
    const reservations = formatReservations(parsedData);

    next({
      type: EMIT_RESERVATIONS_UPDATE,
      reservations,
      clients: store
        .getState()
        .clientsReducer.get('clients')
        .toJS()
    });
  } catch (e) {
    // Most likely cause of failure is error parsing response
    logFetchReservationsAPIError(colors.red(e));
  }
};

export default fetchRoomReservation;
