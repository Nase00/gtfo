/* eslint no-use-before-define:0 */
import { RED,
         TEAL,
         LIGHT_GREEN,
         GREEN,
         ORANGE,
         ONE_MINUTE_STROBE,
         FIVE_MINUTE_STROBE,
         FAINT_LIGHT_LEVEL,
         FULL_LIGHT_LEVEL } from '../constants';

export const squatted = (led) => {
  led.stop(); // Prevent rogue strobing
  led.intensity(FAINT_LIGHT_LEVEL);
  led.color(LIGHT_GREEN);
};

export const vacant = (led) => {
  led.stop(); // Prevent rogue strobing
  led.intensity(FAINT_LIGHT_LEVEL);
  led.color(GREEN);
};

export const occupied = (led) => {
  led.stop(); // Prevent rogue strobing
  led.intensity(FAINT_LIGHT_LEVEL);
  led.color(TEAL);
};

export const oneMinuteWarning = (led) => {
  led.intensity(FULL_LIGHT_LEVEL);
  led.color(RED);
  led.strobe(ONE_MINUTE_STROBE);
};

export const fiveMinuteWarning = (led) => {
  led.intensity(FULL_LIGHT_LEVEL);
  led.color(ORANGE);
  led.strobe(FIVE_MINUTE_STROBE);
};
