export default {
  title: 'Coordinate Schema',
  id: '/CoordinateSchema',
  type: 'object',
  properties: {
    rooms: {
      type: 'object',
      additionalProperties: {
        properties: {
          height: { type: 'number' },
          width: { type: 'number' },
          x: { type: 'number' },
          y: { type: 'number' }
        },
        required: ['height', 'width', 'x', 'y']
      }
    },
    stalls: {
      type: 'object',
      additionalProperties: {
        properties: {
          height: { type: 'number' },
          width: { type: 'number' },
          x: { type: 'number' },
          y: { type: 'number' }
        },
        required: ['height', 'width', 'x', 'y']
      }
    }
  },
  required: ['rooms']
};
