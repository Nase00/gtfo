/**
 * When running with mocks enabled,
 * this service responds with mocked
 * reservation data to simulate the
 * functionality of reservation and
 * stall status APIs.
 */
import getMockReservations from '../mocks/reservations';
import getMockStallOcuppancies from '../mocks/stall-occupancies';

const mocksController = {
  reservationsByRoom(res) {
    const mockReservations = getMockReservations();

    res.json(mockReservations);
  },

  stalls(res) {
    const mockStallOccupancies = getMockStallOcuppancies();

    res.json(mockStallOccupancies);
  }
};

export default mocksController;
