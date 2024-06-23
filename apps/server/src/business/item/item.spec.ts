import type { SubstituteOf } from '@fluffy-spoon/substitute';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import type { DatabaseService } from '~/database/database.service';
import { ItemService } from './item.service';

describe('item service tests', () => {
  let mockDatabaseService: SubstituteOf<DatabaseService>;
  let itemRepository: SubstituteOf<DatabaseService['item']>;
  let itemService: ItemService;

  beforeEach(() => {
    mockDatabaseService = Substitute.for<DatabaseService>();
    itemRepository = Substitute.for<DatabaseService['item']>();
    mockDatabaseService.item.returns!(itemRepository);
    itemService = new ItemService(mockDatabaseService);
  });

  describe('getItemById resolves', () => {
    beforeEach(() => {
      itemRepository.findUnique({ where: { id: '1' } }).resolves({
        id: '1',
        name: 'Test Item',
        available: true,
        itemCatalogId: '1',
        picture: 'test.jpg',
        status: 'available',
      });
    });

    // handles cases where the item exists in the database
    it('should handle existing item in the database', async () => {
      const result = await itemService.getItemById('1');
      expect(result).toBeDefined();
      itemRepository.received(1).findUnique({ where: { id: '1' } });
    });

    // successfully retrieves an item by a valid ID
    it('should return the item when a valid ID is provided', async () => {
      const result = await itemService.getItemById('1');
      expect(result?.id).toBe('1');
    });

    // returns the correct item data structure
    it('should return the correct item data structure', async () => {
      const result = await itemService.getItemById('1');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('available');
      expect(result).toHaveProperty('itemCatalogId');
      expect(result).toHaveProperty('picture');
      expect(result).toHaveProperty('status');
    });
  });

  describe('getItemById rejects', () => {
    beforeEach(() => {
      itemRepository.findUnique(Arg.any()).resolves(null);
    });
    // item ID does not exist in the database
    it('should return null when item ID does not exist in the database', async () => {
      const result = await itemService.getItemById('nonexistent-id');
      expect(result).toBeNull();
    });

    // item ID is an empty string
    it('should return null when item ID is an empty string', async () => {
      const result = await itemService.getItemById('');
      expect(result).toBeNull();
    });

    // item ID is a null value
    it('should return null when item ID is a null value', async () => {
      const result = await itemService.getItemById('null');
      expect(result).toBeNull();
    });
  });
});
