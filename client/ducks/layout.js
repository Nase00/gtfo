import immutable from 'immutable';

import { pluckLocations, handleAction } from 'utils';
import { FAHRENHEIT, CELSIUS, DEFAULT } from 'constants';
import { EMIT_HANDSHAKE_RECEIVED } from './navigation';

export const CONNECT_SOCKET = 'CONNECT_SOCKET';
export const EMIT_LAYOUT_SOCKET_ERROR = 'EMIT_LAYOUT_SOCKET_ERROR';

export const EMIT_ROOM_STATUSES_UPDATE = 'EMIT_ROOM_STATUSES_UPDATE';
export const EMIT_FETCH_ROOM_STATUSES_ERROR = 'EMIT_FETCH_ROOM_STATUSES_ERROR';

export const EMIT_SET_ROOM_PING = 'EMIT_SET_ROOM_PING';
export const EMIT_CLEAR_PING = 'EMIT_CLEAR_PING';

export const EMIT_TOGGLE_DISPLAY_LEGEND = 'EMIT_TOGGLE_DISPLAY_LEGEND';
export const EMIT_TOGGLE_DISPLAY_TEMPERATURE = 'EMIT_TOGGLE_DISPLAY_TEMPERATURE';
export const EMIT_TOGGLE_TEMP_SCALE = 'EMIT_TOGGLE_TEMP_SCALE';

export const EMIT_MARKERS_UPDATE = 'EMIT_MARKERS_UPDATE';

export const EMIT_ROOM_TEMPERATURE_UPDATE = 'EMIT_ROOM_TEMPERATURE_UPDATE';
export const EMIT_ROOM_MOTION_UPDATE = 'EMIT_ROOM_MOTION_UPDATE';

export const EMIT_STALL_OCCUPANCIES_UPDATE = 'EMIT_STALL_OCCUPANCIES_UPDATE';

export const EMIT_FETCH_MARKERS_ERROR = 'EMIT_FETCH_MARKERS_ERROR';
export const EMIT_CLEAR_CONNECTION_ERRORS = 'EMIT_CLEAR_CONNECTION_ERRORS';

export const EMIT_STATUSES_THEME_UPDATE = 'EMIT_STATUSES_THEME_UPDATE';

export const connectSocket = (payload) => ({
  type: CONNECT_SOCKET,
  payload
});

export const emitClearPing = () => ({
  type: EMIT_CLEAR_PING
});

export const emitToggleDisplayLegend = (displayLegend) => ({
  type: EMIT_TOGGLE_DISPLAY_LEGEND,
  displayLegend
});

export const emitToggleDisplayTemp = (displayTemp) => ({
  type: EMIT_TOGGLE_DISPLAY_TEMPERATURE,
  displayTemp
});

export const emitToggleTempScale = (unitOfTemp) => ({
  type: EMIT_TOGGLE_TEMP_SCALE,
  unitOfTemp
});

export const emitStatusesThemeUpdate = (statusesTheme) => ({
  type: EMIT_STATUSES_THEME_UPDATE,
  statusesTheme
});

const initialState = immutable.fromJS({
  meetingRooms: null,
  markers: null,
  stalls: null,
  displayLegend: true,
  displayTemp: true, // User UI option for toggling temperature display on map
  enableTemp: false, // Server variable that governs display of temperature features
  enableMotion: false, // Server variable that governs display of motion features
  enableStalls: false, // Server variable that governs display of stall features
  unitOfTemp: FAHRENHEIT,
  statusesTheme: DEFAULT
});

const layoutReducer = (state = initialState, action) => {
  const reducers = {
    [EMIT_HANDSHAKE_RECEIVED]: () => {
      const { enableTemperature, enableMotion, enableStalls, defaultTempScale } = action.config;

      return state
        .set('enableTemp', enableTemperature || false)
        .set('unitOfTemp', defaultTempScale || FAHRENHEIT)
        .set('enableMotion', enableMotion || false)
        .set('enableStalls', enableStalls || false);
    },

    [EMIT_ROOM_STATUSES_UPDATE]: () => {
      const locations = pluckLocations(action.meetingRooms);

      return state.set('meetingRooms', action.meetingRooms).set('locations', locations);
    },

    [EMIT_FETCH_ROOM_STATUSES_ERROR]: () => state.set('error', action.error),

    [EMIT_STALL_OCCUPANCIES_UPDATE]: () => state.set('stalls', action.stalls),

    [EMIT_CLEAR_CONNECTION_ERRORS]: () => state.delete('error'),

    [EMIT_SET_ROOM_PING]: () => state.set('ping', action.ping),

    [EMIT_CLEAR_PING]: () => state.set('ping', null),

    [EMIT_TOGGLE_DISPLAY_LEGEND]: () => state.set('displayLegend', !action.displayLegend),

    [EMIT_TOGGLE_DISPLAY_TEMPERATURE]: () => state.set('displayTemp', !action.displayTemp),

    [EMIT_TOGGLE_TEMP_SCALE]: () => {
      const unitOfTemp = action.unitOfTemp === FAHRENHEIT ? CELSIUS : FAHRENHEIT;

      return state.set('unitOfTemp', unitOfTemp);
    },

    [EMIT_MARKERS_UPDATE]: () => state.set('markers', action.markers),

    [EMIT_ROOM_TEMPERATURE_UPDATE]: () => {
      const meetingRooms = state.get('meetingRooms').map((room) => {
        if (action.room.id === room.id) {
          room.thermo = action.room.thermo;
        }

        return room;
      });

      return state.set('meetingRooms', meetingRooms);
    },

    [EMIT_ROOM_MOTION_UPDATE]: () => state,

    [EMIT_STATUSES_THEME_UPDATE]: () => state.set('statusesTheme', action.statusesTheme)
  };

  return handleAction(state, action, reducers);
};

export default layoutReducer;
