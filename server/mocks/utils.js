/**
 * Utilities for generating mock data
 */
import moment from 'moment';

import { GAP_PROBABILITY, START_OF_DAY } from './constants';

export const randomMeetingDuration = () => {
  // Most meetings are 30 minutes, some are 60 minutes, and rarely are they 90 minutes
  const durations = [30, 30, 30, 60, 60, 90];

  return durations[Math.floor(Math.random() * (durations.length - 0)) + 0];
};

export const randomReservationGap = () => {
  const introduceGap = Math.floor(Math.random() * (GAP_PROBABILITY - 0)) + 0 <= 3;

  return introduceGap ? randomMeetingDuration() : 0;
};

const generateMockEmail = () => {
  const mockNames = [
    'BlakeHenderson',
    'AliceMurphy',
    'AdamDeMamp',
    'JillianBelk',
    'AndersHolmvik'
  ];
  const randomIndex = () => Math.floor(Math.random() * (mockNames.length - 0)) + 0;

  return `${mockNames[randomIndex()]}@slalom.com`;
};

export const generateMockReservation = (room, beginTimeOffset, endTimeOffset) => ({
  'email': generateMockEmail(),
  'startDate': moment(START_OF_DAY).add(beginTimeOffset, 'minutes').toISOString(),
  'endDate': moment(START_OF_DAY).add(endTimeOffset, 'minutes').toISOString()
});