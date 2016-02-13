/* globals setInterval, clearInterval */
import React from 'react';
import { Style } from 'radium';
import ImmutablePropTypes from 'immutable-props';

import Paper from 'material-ui/lib/paper';

import MeetingRoom from './meeting-room';
import Marker from './marker';

import { applyStyles } from '../../config/composition';
import { rules } from './styles';
import { getPathname } from '../../utils/rooms';
import { PING_TIMEOUT } from '../../constants/svg';

const locationBackdrops = {
  51: require('../../assets/prudential-51.png')
};

const LayoutController = ({ actions, location, layout }) => {
  const { meetingRooms, markers, ping } = layout.toJS();
  const pathname = getPathname(location);

  if (ping) {
    const setPingTimeout = setInterval(() => {
      actions.clearPing();
      clearInterval(setPingTimeout);
    }, PING_TIMEOUT);
  }

  const renderMeetingRooms = meetingRooms.map((room) => (
    <MeetingRoom
      key={`${room.name}`}
      room={room}
      pinged={ping && ping.id === room.id}/>
  ));

  const renderMarkers = markers.map((marker) => (
    <Marker key={`${marker.name}`} marker={marker} {...markers}/>
  ));

  return (
    <Paper zDepth={1}>
      <Style rules={rules.officeLayout}/>
      <image className='office-layout' src={locationBackdrops[pathname]}>
        <svg className='office-layout'>
          {renderMeetingRooms}
          {renderMarkers}
        </svg>
      </image>
    </Paper>
  );
};

LayoutController.propTypes = {
  layout: ImmutablePropTypes.Map.isRequired
};

export default applyStyles(LayoutController);
