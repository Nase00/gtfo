/* eslint no-console:0 */
/* globals console */
import colors from 'colors';
import { lstatSync, readFileSync, writeFileSync } from 'fs';
import moment from 'moment';
import { every, map, flatten } from 'lodash';

import { devices } from '../environment';
import { MOCK_DATA_FILE,
         RESERVATIONS_PER_DAY,
         START_OF_DAY } from './constants';
import { randomMeetingDuration,
         randomReservationGap,
         generateMockReservation } from './utils';

const roomNames = map(devices, (device) => device.name.toLowerCase());

const generateMockData = () => {
  const mockReservations = [];

  // Generate reservations for each room
  roomNames.forEach((roomName) => {
    let beginTimeOffset = moment(START_OF_DAY).minutes();
    let endTimeOffset = beginTimeOffset + randomMeetingDuration();
    const mockRoom = { name: roomName, schedule: [] };

    // Increment reservation times
    for (let i = 0; i < RESERVATIONS_PER_DAY; i++) {
      mockRoom.schedule.push(generateMockReservation(beginTimeOffset, endTimeOffset));

      beginTimeOffset = endTimeOffset + randomReservationGap();
      endTimeOffset = beginTimeOffset + randomMeetingDuration();
    }

    mockReservations.push(mockRoom);
  });

  writeFileSync(MOCK_DATA_FILE, JSON.stringify(mockReservations, null, 2));
};

/**
 * 1. If mock-data.json exists and is up-to-date, leave file alone
 * 2. If mock-data.json exists, and is out-of-date, overwrite with new data
 * 3. If mock-data.json does not exist, create it with new data
 */
const getMockReservations = () => {
  let mockReservations;

  try {
    mockReservations = JSON.parse(readFileSync(MOCK_DATA_FILE, 'utf8'));

    if (lstatSync(MOCK_DATA_FILE).isFile()) {
      // Validate that each reservation is for today
      const allReservations = flatten(map(mockReservations, (room) => map(room.schedule, 'startDate')));
      const current = every(allReservations, (startDate) => {
        const isCurrent = moment().calendar(startDate, { sameDay: '[Today]' }) === 'Today';

        return isCurrent;
      });

      if (!current) {
        console.log(colors.yellow('Mock data out-of-date, overwriting with new mock-data.json.'));

        generateMockData();

        // Re-read and re-assign
        mockReservations = JSON.parse(readFileSync(MOCK_DATA_FILE, 'utf8'));
      }
    }
  } catch (e) {
    console.log(colors.yellow('No mock-data.json present, generating new mock-data.json.'));

    generateMockData();

    // Re-read and re-assign
    mockReservations = JSON.parse(readFileSync(MOCK_DATA_FILE, 'utf8'));
  }

  return mockReservations;
};

export default getMockReservations;
