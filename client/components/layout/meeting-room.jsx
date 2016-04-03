import React, { PropTypes } from 'react';
import { VelocityComponent } from 'velocity-react';

import Temperature from './temperature';

import { applyStyles } from '../../config/composition';
import { styles } from './styles';
import { parsePosition, parseShape } from '../../utils';
import { OFFLINE,
         PINGED,
         PING_ANIMATION_LOOPS,
         PING_ANIMATION_TIMEOUT,
         ROOM_NAME_TEXT_DX,
         ROOM_NAME_TEXT_DY } from '../../constants';

const MeetingRoom = (props) => {
  const { name,
          coordinates,
          alert,
          tmpVoltage,
          displayTemp,
          pinged } = props;

  const pingAnimation = {
    fill: styles[PINGED],
    opacity: pinged ? 1 : 0
  };

  const pingLoop = pinged ? PING_ANIMATION_LOOPS : 0;

  const temperature = displayTemp ? (
    <Temperature
      tmpVoltage={tmpVoltage}
      coordinates={coordinates}/>
  ) : null;

  return (
    <svg {...parsePosition(coordinates)}>
      <VelocityComponent
        animation={{ fill: styles[alert || OFFLINE] }}>
        <rect
          stroke={styles.svgStroke}
          {...parseShape(coordinates)}/>
      </VelocityComponent>
      <VelocityComponent
        animation={pingAnimation}
        loop={pingLoop}
        duration={PING_ANIMATION_TIMEOUT}
        style={{ stroke: styles.svgStroke }}>
          <rect {...parseShape(coordinates)}/>
      </VelocityComponent>
      <text
        className='room-text'
        dx={ROOM_NAME_TEXT_DX}
        dy={ROOM_NAME_TEXT_DY}
        {...parseShape(coordinates)}>
          {name}
      </text>
      {temperature}
    </svg>
  );
};

MeetingRoom.propTypes = {
  name: PropTypes.string.isRequired,
  coordinates: PropTypes.object.isRequired,
  alert: PropTypes.string,
  tmpVoltage: PropTypes.number,
  displayTemp: PropTypes.bool,
  pinged: PropTypes.bool
};

export default applyStyles(MeetingRoom);
