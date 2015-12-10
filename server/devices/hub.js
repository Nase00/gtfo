/* eslint no-console:0 */
// Entry point for controlling remote devices

// TODO integrate into server

import { Board, Led } from 'johnny-five';
import Particle from 'particle-io';
import temporal from 'temporal';
import fs from 'fs';
import pixel from 'node-pixel';

import {
  PHOTON_PINS,
  IN,
  OUT
} from './constants/values';

import {
  // RED,
  PURPLE
} from './constants/colors';

const devices = JSON.parse(fs.readFileSync('./devices.json', 'utf8')).devices;

// TODO integrate multiple boards

const board = new Board({
  io: new Particle({
    token: devices[0].accessToken,
    deviceId: devices[0].id
  })
});

const hub = () => {
  board.on('ready', () => {
    console.log(`Connected to ${board.id}`);

    // const strip = new pixel.Strip({
    //   board: board,
    //   controller: "I2CBACKPACK",
    //   strips: [ {pin: 'D1', length: 12}, ], // this is preferred form for definition
    // });
    //
    // strip.on("ready", function() {
    //   // strip.color("#ff0000"); // turns entire strip red using a hex colour
    //   // strip.show();
    // });

    const led = new Led.RGB({
      pins: PHOTON_PINS
    });

    led.color(PURPLE);

    let intensity = 100;
    let fadeDirection = IN;

    temporal.loop(6, () => {
      switch (intensity) {
        case 0:
          fadeDirection = IN;
          break;
        case 100:
          fadeDirection = OUT;
          break;
      }

      switch (fadeDirection) {
        case IN:
          intensity += 1;
          break;
        case OUT:
          intensity -= 1;
          break;
      }

      console.log(`intensity: ${intensity} \n fadeDirection: ${fadeDirection}`);

      led.intensity(intensity);
    });

    board.repl.inject({
      // strip
    });
  });
};

export default hub;
