/* eslint no-magic-numbers:0 */
import { colors, fonts, breakpoints, devices } from '../../common/styles';

const layoutSelectors = [
  'image.office-background',
  'svg.office-layout',
  '.office-layout-container'
].join(', ');

export const rules = {
  officeLayout: {
    'image.office-background': {
      zIndex: 0,
      display: 'block',
      position: 'absolute',
      top: '30px',
      width: '300px',
      height: '345px',
      overflow: 'hidden',
      backgroundSize: 'fill'
    },

    'text.room-text, text.temperature-text': {
      zIndex: 200,
      fontSize: '10px',
      fontFamily: fonts.primary,
      fontWeight: 'bold',
      textShadow: `${colors.GREY} 0px 0px 0px`
    },

    'text.temperature-text': {
      fontSize: '10px',
      fontFamily: fonts.secondary,
      opacity: 0.5
    },

    'text.marker-text': {
      fontSize: '14px',
      fontWeight: 'bold',
      opacity: 0.5
    },

    'text.restroom-marker': {
      position: 'absolute',
      fontSize: '20px',
      fill: colors.DARK_GREY
    },

    mediaQueries: {
      [breakpoints.afterExtraSmall]: {
        [layoutSelectors]: {
          width: '500px',
          height: '576px'
        },

        'text.room-text': {
          fontSize: '15px'
        },

        '.map-legend': {
          position: 'absolute',
          top: '-25px',
          left: '-50px',
          transform: 'scale(.25)',
          backgroundColor: 'rgba(255, 255, 255, .25)'
        }
      },

      [breakpoints.afterSmall]: {
        [layoutSelectors]: {
          width: '608px',
          height: '700px'
        },

        'text.room-text': {
          fontSize: '18px',
          transform: 'translateY(2px)'
        },

        '.map-legend': {
          left: 'auto',
          right: 0,
          transform: 'scale(.35)'
        }
      },

      [breakpoints.afterMedium]: {
        [layoutSelectors]: {
          width: '608px',
          height: '700px'
        },

        'text.room-text, text.temperature-text': {
          transform: 'translateY(4px)'
        }
      },

      [breakpoints.afterLarge]: {
        [layoutSelectors]: {
          width: '695px',
          height: '800px'
        },

        'text.room-text': {
          fontSize: '22px',
        },

        'text.room-text, text.temperature-text': {
          transform: 'translateY(8px)'
        },

        '.map-legend': {
          top: '25px',
          left: '25px',
          right: 'auto',
          transform: 'scale(.5)'
        },

        'text.restroom-marker': {
          fontSize: '30px',
          transform: 'translateY(8px)'
        }
      },

      [breakpoints.afterExtraLarge]: {
        [layoutSelectors]: {
          width: '1050px',
          height: '1209px'
        },

        'text.temperature-text': {
          transform: 'translateY(34px)'
        },

        'text.restroom-marker': {
          fontSize: '40px',
          transform: 'translateY(28px)'
        }
      },

      [devices.iphone]: {
        [layoutSelectors]: {
          width: '908px',
          height: '1046px'
        },

        '.map-legend': {
          transform: 'scale(.5)'
        }
      },

      [breakpoints.portrait]: {
        [layoutSelectors]: {
          top: '100px'
        }
      }
    }
  }
};
