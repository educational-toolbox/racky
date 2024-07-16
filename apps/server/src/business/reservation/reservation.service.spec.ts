import type { SubstituteOf } from '@fluffy-spoon/substitute';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import type { DatabaseService } from '../../database/database.service';
import { ReservationService } from './reservation.service';

describe('reservation service tests', () => {
  /**
   * Mocks the database service and reservation repository. This way we control the
   * behavior of the database service and reservation repository since those are not tested by this test.
   */
  let mockDatabaseService: SubstituteOf<DatabaseService>;
  let reservationRepository: SubstituteOf<DatabaseService['reservation']>;

  let reservationService: ReservationService;

  beforeEach(() => {
    mockDatabaseService = Substitute.for<DatabaseService>();
    reservationRepository = Substitute.for<DatabaseService['reservation']>();
    mockDatabaseService.reservation.returns!(reservationRepository);
    reservationService = new ReservationService(mockDatabaseService);
  });

  // GET RESERVATION BY ID PASS
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

    it('should handle existing reservation in the database', async () => {
      const result = await reservationService.findOne('1');
      reservationRepository.received(1).findUnique({ where: { id: '1' } });
      expect(result).toBeDefined();
    });

    it('should return the reservation when a valid ID is provided', async () => {
      const result = await reservationService.findOne('1');
      expect(result?.id).toBe('1');
    });

    it('should return the correct reservation data structure', async () => {
      const result = await reservationService.findOne('1');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('userId');
    });
  });

  // GET RESERVATION BY ID REJECTS
  describe('getReservationById rejects', () => {
    beforeEach(() => {
      reservationRepository.findUnique(Arg.any()).resolves(null);
    });
    it('should return null when reservation ID does not exist in the database', async () => {
      const result = await reservationService.findOne('nonexistent-id');
      expect(result).toBeNull();
    });

    it('should return null when reservation ID is an empty string', async () => {
      const result = await reservationService.findOne('');
      expect(result).toBeNull();
    });

    it('should return null when reservation ID is a null value', async () => {
      const result = await reservationService.findOne('null');
      expect(result).toBeNull();
    });
  });

  // GET RESERVATION BY USERID PASS
  describe('getReservationByUserId resolves', () => {
    beforeEach(() => {
      reservationRepository.findMany({ where: { userId: '1' } }).resolves([
        {
          id: '1',
          startDate: new Date('2024-10-02'),
          endDate: new Date('2024-11-02'),
          status: 'CONFIRMED',
          userId: '1',
        },
      ]);
    });

    it('should handle existing reservation in the database', async () => {
      const result = await reservationService.findByUserId('1');
      reservationRepository.received(1).findMany({ where: { userId: '1' } });
      expect(result).toBeDefined();
    });

    it('should return the reservation when a valid ID is provided', async () => {
      const result = await reservationService.findByUserId('1');
      expect(result).toHaveLength(1);
    });

    it('should return the correct reservation data structure', async () => {
      const result = await reservationService.findByUserId('1');
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('startDate');
      expect(result[0]).toHaveProperty('endDate');
      expect(result[0]).toHaveProperty('status');
      expect(result[0]).toHaveProperty('userId');
    });
  });

  // GET RESERVATION BY USERID REJECTS
  describe('getReservationByUserId rejects', () => {
    beforeEach(() => {
      reservationRepository.findMany(Arg.any()).resolves([]);
    });
    it('should return an empty array when no reservations exist in the database', async () => {
      const result = await reservationService.findByUserId('nonexistent-id');
      expect(result).toHaveLength(0);
    });

    it('should return an empty array when reservation ID is an empty string', async () => {
      const result = await reservationService.findByUserId('');
      expect(result).toHaveLength(0);
    });

    it('should return an empty array when reservation ID is a null value', async () => {
      const result = await reservationService.findByUserId('null');
      expect(result).toHaveLength(0);
    });
  });

  // GET ALL RESERVATIONS PASS
  describe('getAllReservations resolves', () => {
    beforeEach(() => {
      reservationRepository.findMany().resolves([
        {
          id: '1',
          startDate: new Date('2024-10-02'),
          endDate: new Date('2024-11-02'),
          status: 'CONFIRMED',
          userId: '1',
        },
        {
          id: '2',
          startDate: new Date('2024-10-02'),
          endDate: new Date('2024-11-02'),
          status: 'CONFIRMED',
          userId: '2',
        },
      ]);
    });

    it('should handle existing reservations in the database', async () => {
      const result = await reservationService.findAll();
      reservationRepository.received(1).findMany();
      expect(result).toBeDefined();
    });

    it('should return all reservations when they exist in the database', async () => {
      const result = await reservationService.findAll();
      expect(result).toHaveLength(2);
    });

    it('should return the correct reservation data structure', async () => {
      const result = await reservationService.findAll();
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('startDate');
      expect(result[0]).toHaveProperty('endDate');
      expect(result[0]).toHaveProperty('status');
      expect(result[0]).toHaveProperty('userId');
    });
  });

  describe('getAllReservations rejects', () => {
    beforeEach(() => {
      reservationRepository.findMany().resolves([]);
    });

    it('should return an empty array when no reservations exist in the database', async () => {
      const result = await reservationService.findAll();
      expect(result).toHaveLength(0);
    });
  });

  // CREATE RESERVATION PASS
  describe('createReservation resolves', () => {
    beforeEach(() => {
      reservationRepository.create(Arg.any()).resolves({
        id: '1',
        startDate: new Date('2024-10-02'),
        endDate: new Date('2024-11-02'),
        status: 'CONFIRMED',
        userId: '1',
      });
    });

    it('should create a new reservation in the database', async () => {
      const result = await reservationService.create(
        {
          startDate: new Date('2024-10-02'),
          endDate: new Date('2024-11-02'),
          status: 'CONFIRMED',
        },
        '1',
      );
      reservationRepository.received(1).create(Arg.any());
      expect(result).toBeDefined();
    });

    it('should return the correct reservation data structure', async () => {
      const result = await reservationService.create(
        {
          startDate: new Date('2024-10-02'),
          endDate: new Date('2024-11-02'),
          status: 'CONFIRMED',
        },
        '1',
      );
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('userId');
    });
  });

  // UPDATE RESERVATION PASS
  describe('updateReservation resolves', () => {
    beforeEach(() => {
      reservationRepository.update(Arg.any()).resolves({
        id: '1',
        startDate: new Date('2024-10-02'),
        endDate: new Date('2024-11-02'),
        status: 'CONFIRMED',
        userId: '1',
      });
    });

    it('should update an existing reservation in the database', async () => {
      const result = await reservationService.update(
        {
          id: '1',
          startDate: new Date('2024-10-02'),
          endDate: new Date('2024-11-02'),
          status: 'CONFIRMED',
        },
        '1',
      );
      reservationRepository.received(1).update(Arg.any());
      expect(result).toBeDefined();
    });

    it('should return the correct reservation data structure', async () => {
      const result = await reservationService.update(
        {
          id: '1',
          startDate: new Date('2024-10-02'),
          endDate: new Date('2024-11-02'),
          status: 'CONFIRMED',
        },
        '1',
      );
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('userId');
    });
  });

  // DELETE RESERVATION PASS
  describe('deleteReservation resolves', () => {
    beforeEach(() => {
      reservationRepository.delete({ where: { id: '1' } }).resolves({
        id: '1',
        startDate: new Date('2024-10-02'),
        endDate: new Date('2024-11-02'),
        status: 'CONFIRMED',
        userId: '1',
      });
    });

    it('should delete an existing reservation in the database', async () => {
      const result = await reservationService.delete('1');
      reservationRepository.received(1).delete(Arg.any());
      expect(result).toBeDefined();
    });

    it('should return the correct reservation data structure', async () => {
      const result = await reservationService.delete('1');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('userId');
    });
  });
});
