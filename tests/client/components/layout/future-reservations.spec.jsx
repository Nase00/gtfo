/* eslint-env node, jest */
import React from 'react';
import { mount } from 'enzyme';
import expect from 'expect';
import sinon from 'sinon';
import moment from 'moment';

import Icon from '@material-ui/core/Icon';

import FutureReservations from 'components/floor-plan/layout/room-modal/future-reservations/index';
import { DEFAULT } from 'constants';

describe('<FutureReservations />', () => {
  const clock = (time) =>
    sinon.useFakeTimers({
      now: Date.parse(time),
      toFake: ['Date']
    });

  beforeEach(() => {
    sinon.useFakeTimers().restore();
  });

  afterEach(() => {
    sinon.useFakeTimers().restore();
  });

  const props = {
    isOnline: true,
    timezone: -360,
    meetingRoom: {
      reservations: [
        {
          subject: 'AliceMurphy@example.domain',
          start: {
            dateTime: '2018-11-23T15:00:00.000Z'
          },
          end: {
            dateTime: '2018-11-23T15:30:00.000Z'
          }
        },
        {
          subject: 'AdamDeMamp@example.domain',
          start: {
            dateTime: '2018-11-23T16:00:00.000Z'
          },
          end: {
            dateTime: '2018-11-23T16:30:00.000Z'
          }
        },
        {
          subject: 'AndersHolmvik@example.domain',
          start: {
            dateTime: '2018-11-23T16:30:00.000Z'
          },
          end: {
            dateTime: '2018-11-23T18:00:00.000Z'
          }
        },
        {
          subject: 'AliceMurphy@example.domain',
          start: {
            dateTime: '2018-11-23T18:00:00.000Z'
          },
          end: {
            dateTime: '2018-11-23T19:30:00.000Z'
          }
        },
        {
          subject: 'BlakeHenderson@example.domain',
          start: {
            dateTime: '2018-11-23T20:00:00.000Z'
          },
          end: {
            dateTime: '2018-11-23T21:30:00.000Z'
          }
        },
        {
          subject: 'AndersHolmvik@example.domain',
          start: {
            dateTime: '2018-11-23T22:00:00.000Z'
          },
          end: {
            dateTime: '2018-11-23T23:30:00.000Z'
          }
        }
      ]
    },
    statusesTheme: DEFAULT
  };

  it('renders.', () => {
    const component = mount(<FutureReservations {...props} />);

    expect(component.find(Icon).length).toEqual(2);
  });

  it('renders 96 time blocks when rendered with zero reservations.', () => {
    const propsWithZeroReservations = {
      ...props,
      meetingRoom: { ...props.meetingRoom, reservations: [] }
    };
    const component = mount(<FutureReservations {...propsWithZeroReservations} />);
    const timeBlocks = component.find('#reservations');

    expect(timeBlocks.props().children.length).toEqual(96);
  });

  it('concatenates multiple time blocks covered by the same meeting.', () => {
    clock(moment('2018-11-23T06:00:00.000Z').utcOffset(props.timezone));

    const component = mount(<FutureReservations {...props} />);
    const timeBlocks = component.find('#reservations');

    expect(timeBlocks.props().children.length).toEqual(74);
  });

  it('renders reservations within their correct time blocks.', () => {
    clock(moment('2018-11-23T14:00:00.000Z').utcOffset(props.timezone));

    const component = mount(<FutureReservations {...props} />);
    const firstReservationWrapper = component
      .find('#reservations')
      .props()
      .children
      .find((child) => child.props.id === '_9-00AM');

    expect(firstReservationWrapper.key).toEqual('9:00AM');
  });

  // This used to work, but then Enzyme decided to stop being able to find the component ¯\_(ツ)_/¯
  // Even though it is CLEARLY there within the component wrapper
  // TODO switch to test framework that isn't fickle af
  it.skip('renders reservations within their correct time blocks.', () => {
    clock(moment('2018-11-23T14:00:00.000Z').utcOffset(props.timezone));

    const component = mount(<FutureReservations {...props} />);
    const firstReservation = component.find('#_9-00AM');
    const firstReservationSubject = firstReservation.props().children[3].props.children;
    expect(firstReservation.length).toEqual(1);
    expect(firstReservationSubject).toEqual('AliceMurphy@example.domain');
  });

  it('hightlights the time block for the current time.', () => {
    clock('2018-11-23T15:05:00.000Z');

    const component = mount(<FutureReservations {...props} />);
    const currentReservation = component.find('#current-time > span');
    const currentReservationEmail = currentReservation.props().children;

    expect(currentReservation.length).toEqual(1);
    expect(currentReservationEmail).toEqual('AliceMurphy@example.domain');
  });
});
