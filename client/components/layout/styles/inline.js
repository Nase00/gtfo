import { colors } from '../../common/styles';

export const styles = {
  paperOverride: {
    height: '100%'
  },

  swipableOverride: {
    overflowY: 'scroll',
    height: '100%',
    width: '100%'
  },

  officeLayoutContainer: {
    right: '0',
    left: '0',
    margin: 'auto auto'
  },

  locationHighlight: {
    height: '24px',
    width: '24px',
    x: '24px',
    y: '0'
  },

  mapLegendItem: {
    textAlign: 'left',
    fontSize: '40px'
  },

  placeMarker: {
    fill: colors.primary
  },

  svgStroke: colors.GREY,

  OFFLINE: colors.GREY,

  BOOKED: colors.BLUE,

  VACANT: colors.GREEN,

  ONE_MINUTE_WARNING: colors.RED,

  FIVE_MINUTE_WARNING: colors.ORANGE,

  PINGED: colors.YELLOW
};