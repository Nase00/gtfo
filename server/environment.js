/* eslint array-callback-return:0 */
import path from 'path';
import { readFileSync } from 'fs';

import validator from '../environment/validation';
import { FileValidationError } from './errors';

const readFile = (fileName) => {
  const filePath = path.join('./environment', fileName);

  return JSON.parse(readFileSync(filePath, 'utf8'));
};

const { config } = readFile('config.json');
const { devices } = readFile('devices.json');
const { markers } = readFile('markers.json');
const { coordinates } = readFile('coordinates.json');

if (validator.validate(config, '/ConfigSchema').errors.length) {
  throw new FileValidationError('config');
}

if (validator.validate(devices, '/DevicesSchema').errors.length) {
  throw new FileValidationError('devices');
}

if (validator.validate(markers, '/MarkersSchema').errors.length) {
  throw new FileValidationError('markers');
}

if (validator.validate(coordinates, '/CoordinatesSchema').errors.length) {
  throw new FileValidationError('coordinates');
}

export { config, devices, markers, coordinates };
