import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'withstyles';

import Tooltip from '@material-ui/core/Tooltip';
import Place from '@material-ui/icons/Place';
import Zoom from '@material-ui/core/Zoom';

import { parsePosition } from 'utils';
import { ROOM_MARKER_TEXT_DX, ROOM_MARKER_TEXT_DY } from 'client/constants';
import stylesGenerator from './styles';

const Marker = ({ computedStyles, marker, youAreHere }) => {
  const isAnchor = marker.type === 'anchor';
  const withTooltip = (node) => (
    <Tooltip title={marker.description} TransitionComponent={Zoom} placement='top'>
      {node}
    </Tooltip>
  );

  const markerText = (
    <text
      className={`${computedStyles.text} ${marker.type || 'default'}-marker`}
      dx={ROOM_MARKER_TEXT_DX}
      dy={ROOM_MARKER_TEXT_DY}>
      {marker.name}
    </text>
  );

  const markerElement = (
    <svg {...parsePosition(marker.coordinates)}>
      {marker.description ? withTooltip(markerText) : markerText}
      {youAreHere && isAnchor ? <Place className={computedStyles.placeMarker} /> : null}
    </svg>
  );

  return markerElement;
};

Marker.propTypes = {
  computedStyles: PropTypes.shape({
    placeMarker: PropTypes.object.isRequired,
    text: PropTypes.object.isRequired
  }).isRequired,
  marker: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    coordinates: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
  youAreHere: PropTypes.bool
};

export default withStyles(stylesGenerator)(Marker);
