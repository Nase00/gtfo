/* globals document */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'withstyles';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import scrollIntoView from 'scroll-into-view';
import scroll from 'scroll';

import Icon from '@material-ui/core/Icon';

import { TIME_FORMAT, DATE_TIME_FORMAT, PROP_TYPES, START_OF_DAY, END_OF_DAY } from 'client/constants';
import { genReservationsHyperlink } from 'utils';
import stylesGenerator from './styles';

let scrollTimeout;

/**
 * Displays meeting rooms for the day.
 * "Blocks" of 15-minutes are created for 7AM-7PM.
 * Meeting reservations are mapped to each 15-minute block they occupy.
 */
class FutureReservations extends PureComponent {
  static propTypes = {
    computedStyles: PropTypes.shape({
      base: PropTypes.object.isRequired,
      right: PropTypes.object.isRequired,
      status: PropTypes.func.isRequired,
      scrollIcon: PropTypes.object.isRequired
    }).isRequired,
    timezone: PropTypes.number.isRequired,
    isOnline: PropTypes.bool.isRequired,
    meetingRoom: PROP_TYPES.meetingRoom.isRequired
  };

  CURRENT_TIME_SELECTOR = 'current-time';

  SCROLL_DELAY = 1500;

  componentDidMount() {
    this.scrollToCurrentTime();
  }

  componentDidUpdate() {
    this.scrollToCurrentTime();
  }

  scrollToCurrentTime = () => {
    scrollTimeout = setTimeout(
      () =>
        scrollIntoView(document.getElementById(this.CURRENT_TIME_SELECTOR), {
          align: {
            top: 0
          }
        }),
      this.SCROLL_DELAY
    );
  };

  scroll = (direction) => {
    this.clearScrollTimeout();

    const reservationsEl = document.getElementById('reservations');

    if (direction === 'up') {
      scroll.top(reservationsEl, reservationsEl.scrollTop - 300);
    } else if (direction === 'down') {
      scroll.top(reservationsEl, reservationsEl.scrollTop + 300);
    }

    this.scrollToCurrentTime();
  };

  clearScrollTimeout = () => {
    clearTimeout(scrollTimeout);
  };

  genTimeBlocks = () => {
    const { timezone } = this.props;

    return new Array(96).fill(1).map((e, i) => ({
      time: moment('12:00:01AM', 'h:mm:ssA')
        .add((i + 1) * 15, 'm')
        .utcOffset(timezone),
      endTime: moment('12:15:00AM', 'h:mm:ssA')
        .add((i + 1) * 15, 'm')
        .utcOffset(timezone)
    }));
  };

  mapReservations = ({ time, endTime }) => {
    const { meetingRoom, timezone } = this.props;

    if (!meetingRoom.reservations) return { time, endTime };

    const matchingReservation = meetingRoom.reservations
      .map((reservation) => {
        const startDateTime = get(reservation, 'start.dateTime');
        const endDateTime = get(reservation, 'end.dateTime');

        const isReserved = moment(time)
          .utcOffset(timezone)
          .isBetween(
            moment(startDateTime).utcOffset(timezone),
            moment(endDateTime).utcOffset(timezone)
          );

        return isReserved ? reservation : false;
      })
      .filter((e) => e)[0];

    const isCurrentTime = moment()
      .utcOffset(timezone)
      .isBetween(
        moment(time).utcOffset(timezone),
        moment(time)
          .utcOffset(timezone)
          .add(15, 'm')
      );

    return {
      reservation: matchingReservation,
      isCurrentTime,
      time,
      endTime
    };
  };

  /**
   * Concatenates reservations onto time blocks,
   * compressing multiple time blocks that span the same reservation.
   */
  reduceTimeBlocks = (acc, value) => {
    const { reservation, endTime } = value;
    const prevValue = acc[acc.length - 1] || {};
    const prevTime = get(prevValue, 'time') || moment(START_OF_DAY);
    const startDateTime = get(reservation, 'start.dateTime');
    const endDateTime = get(reservation, 'end.dateTime');

    const isBetweenReservation = moment(prevTime).isBetween(
      moment(startDateTime),
      moment(endDateTime),
      null,
      '[)'
    );

    if (isBetweenReservation) {
      const mergedReservation = {
        ...acc.pop(),
        time: moment(prevTime),
        endTime,
        reservation: isEmpty(value.reservation) ? get(prevValue, 'reservation') : value.reservation,
        isCurrentTime: value.isCurrentTime || prevValue.isCurrentTime,
        increments: prevValue.increments ? prevValue.increments + 1 : 1
      };

      return acc.concat(mergedReservation);
    }

    return acc.concat({
      ...value,
      endTime: !isEmpty(reservation) ? moment(value.time).add(15, 'm') : value.endTime
    });
  };

  // Enzyme tests are weirdly picky about selectors
  safeSelector = (time) =>
    `_${time
      .utcOffset(this.props.timezone)
      .format(TIME_FORMAT)
      .replace(':', '-')}`;

  renderTime = (value) => {
    const { reservation, time, endTime, isCurrentTime } = value;
    const { computedStyles } = this.props;
    const formattedTime = time.format(TIME_FORMAT);

    return (
      <span
        key={formattedTime}
        id={isCurrentTime ? this.CURRENT_TIME_SELECTOR : this.safeSelector(time)}
        className={computedStyles.status(value)}>
        {this.renderFormattedDateRange(value)}
        <span className={computedStyles.right}>
          {get(reservation, 'subject') || this.renderReservationLink(time, endTime)}
        </span>
      </span>
    );
  };

  renderFormattedDateRange = (value) => {
    const { reservation, time, endTime } = value;
    const { timezone } = this.props;
    const startDateTime = get(reservation, 'start.dateTime');
    const endDateTime = get(reservation, 'end.dateTime');
    const formattedTime = time.format(TIME_FORMAT);
    const shouldExcludeDate = isEmpty(reservation)
      || this.reservationOverlapsTodayOnly(reservation);
    const dateTimeFormat = shouldExcludeDate ? TIME_FORMAT : DATE_TIME_FORMAT;

    const formattedStartDate = startDateTime
      ? moment(startDateTime)
        .utcOffset(timezone)
        .format(dateTimeFormat)
      : formattedTime;
    const formattedEndDate = endDateTime
      ? moment(endDateTime)
        .utcOffset(timezone)
        .format(dateTimeFormat)
      : endTime.format(dateTimeFormat);

    return `${formattedStartDate} to ${formattedEndDate}`;
  };

  reservationOverlapsTodayOnly = (reservation) =>
    moment(reservation.start.dateTime).isSameOrAfter(START_OF_DAY)
    && moment(reservation.end.dateTime).isSameOrAfter(END_OF_DAY);

  renderReservationLink = (time, endTime) => {
    const { meetingRoom } = this.props;

    if (!meetingRoom.outlookWebAccessId) return null;

    const reservationLink = genReservationsHyperlink(meetingRoom, time, endTime);

    return (
      <a alt='reserve' href={reservationLink} target='_blank' rel='noopener noreferrer'>
        <Icon>open_in_new</Icon>
      </a>
    );
  };

  render() {
    const { computedStyles, isOnline } = this.props;

    return (
      <>
        <Icon className={computedStyles.scrollIcon} onClick={() => this.scroll('up')}>
          keyboard_arrow_up
        </Icon>
        <div
          id='reservations'
          className={computedStyles.base}
          onTouchEnd={this.scrollToCurrentTime}
          onTouchStart={this.clearScrollTimeout}>
          {isOnline
            ? this.genTimeBlocks()
              .map(this.mapReservations)
              .reduce(this.reduceTimeBlocks, [])
              .map(this.renderTime)
            : this.genTimeBlocks()
              .map(this.mapReservations)
              .map(this.renderTime)}
        </div>
        <Icon className={computedStyles.scrollIcon} onClick={() => this.scroll('down')}>
          keyboard_arrow_down
        </Icon>
      </>
    );
  }
}

export default withStyles(stylesGenerator)(FutureReservations);
