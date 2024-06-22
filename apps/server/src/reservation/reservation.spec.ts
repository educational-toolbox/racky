import type { SubstituteOf } from '@fluffy-spoon/substitute';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import type { DatabaseService } from '../database/database.service';
import { ReservationService } from './reservation.service';

describe('reservation service tests', () => {
  let mockDatabaseService: SubstituteOf<DatabaseService>;
  let reservationRepository: SubstituteOf<DatabaseService['reservation']>;
  let reservationService: ReservationService;

  beforeEach(() => {
    mockDatabaseService = Substitute.for<DatabaseService>();
    reservationRepository = Substitute.for<DatabaseService['reservation']>();
    mockDatabaseService.reservation.returns!(reservationRepository);
    reservationService = new ReservationService(mockDatabaseService);
  });

  describe('getReservationById resolves', () => {
    beforeEach(() => {
      reservationRepository.findUnique({ where: { id: '1' } }).resolves({
        id: '1',
        startDate: new Date('2024-10-02'),
        endDate: new Date('2024-11-02'),
        status: 'CONFIRMED',
        userId: '1',
      });
    });

    // handles cases where the reservation exists in the database
    it('should handle existing reservation in the database', async () => {
      const result = await reservationService.findOne('1');
      reservationRepository.received(1).findUnique({ where: { id: '1' } });
      expect(result).toBeDefined();
    });

    // successfully retrieves an reservation by a valid ID
    it('should return the reservation when a valid ID is provided', async () => {
      const result = await reservationService.findOne('1');
      expect(result?.id).toBe('1');
    });

    // returns the correct reservation data structure
    it('should return the correct reservation data structure', async () => {
      const result = await reservationService.findOne('1');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('userId');
    });
  });

  describe('getReservationById rejects', () => {
    beforeEach(() => {
      reservationRepository.findUnique(Arg.any()).resolves(null);
    });
    // reservation ID does not exist in the database
    it('should return null when reservation ID does not exist in the database', async () => {
      const result = await reservationService.findOne('nonexistent-id');
      expect(result).toBeNull();
    });

    // reservation ID is an empty string
    it('should return null when reservation ID is an empty string', async () => {
      const result = await reservationService.findOne('');
      expect(result).toBeNull();
    });

    // reservation ID is a null value
    it('should return null when reservation ID is a null value', async () => {
      const result = await reservationService.findOne('null');
      expect(result).toBeNull();
    });
  });
});
