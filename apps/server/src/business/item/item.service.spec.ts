import type { SubstituteOf } from '@fluffy-spoon/substitute';
import { Arg, Substitute } from '@fluffy-spoon/substitute';
import type { DatabaseService } from '../../database/database.service';
import { ItemService } from './item.service';

describe('item service tests', () => {
  /**
   * Mocks the database service and item repository. This way we control the
   * behavior of the database service and item repository since those are not tested by this test.
   */
  let mockDatabaseService: SubstituteOf<DatabaseService>;
  let itemRepository: SubstituteOf<DatabaseService['item']>;

  let itemService: ItemService;

  beforeEach(() => {
    mockDatabaseService = Substitute.for<DatabaseService>();
    itemRepository = Substitute.for<DatabaseService['item']>();
    mockDatabaseService.item.returns!(itemRepository);
    itemService = new ItemService(mockDatabaseService);
  });

  const defaultInclude = {
    catalogueItem: { select: { name: true, id: true } },
  };
  describe('getItemById resolves', () => {
    beforeEach(() => {
      itemRepository
        .findUnique({
          where: { id: '1' },
          include: { catalogueItem: { select: { name: true, id: true } } },
        })
        .resolves(
          {
            id: '1',
            name: 'Test Item',
            catalogueItemId: '1',
            picture: 'test.jpg',
            status: 'DRAFT',
          },
          {
            id: '2',
            name: 'Item2',
            catalogueItemId: '1',
            picture: 'test.jpg',
            status: 'AVAILABLE',
          },
        );
    });

    // handles cases where the item exists in the database
    it('should handle existing item in the database', async () => {
      const result = await itemService.getItemById('1');
      expect(result).toBeDefined();
      itemRepository
        .received(1)
        .findUnique({ where: { id: '1' }, include: defaultInclude });
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
      expect(result).toHaveProperty('catalogueItemId');
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

    it('should return an empty array when reservation ID is an null value', async () => {
      const result = await itemService.getItemById('');
      expect(result).toBeNull();
    });
  });

  describe('getItemsByCategory', () => {
    beforeEach(() => {
      itemRepository
        .findMany({
          where: { catalogueItemId: 'cat1' },
          include: { catalogueItem: { select: { name: true, id: true } } },
        })
        .resolves([
          {
            id: '1',
            name: 'Item 1',
            picture: 'test.png',
            status: 'AVAILABLE',
            catalogueItemId: '1',
          },
          {
            id: '2',
            name: 'Item 2',
            picture: 'test2.png',
            status: 'UNAVAILABLE',
            catalogueItemId: '1',
          },
        ]);
    });
    it('returns items for a valid category ID', async () => {
      const result = await itemService.getItems(
        'org1',
        'categ1',
        'catal1',
        'search',
      );
      itemRepository.received(1).findMany({
        where: {
          name: { contains: 'search', mode: 'insensitive' },
          catalogueItem: {
            organizationId: 'org1',
            categoryId: 'categ1',
          },
          catalogueItemId: 'catal1',
        },
        include: defaultInclude,
      });
      expect(result).toBeDefined();
    });

    it('returns an empty array for an invalid category ID', async () => {
      const result = await itemService.getItems('2');
      itemRepository.received(1).findMany({
        where: {
          name: { contains: undefined, mode: 'insensitive' },
          catalogueItem: { organizationId: '2' },
        },
        include: defaultInclude,
      });
      expect(result).toBeDefined();
    });

    it('should return the correct reservation data structure', async () => {
      const result = await itemService.getItems('1');
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('catalogueItemId');
      expect(result[0]).toHaveProperty('picture');
      expect(result[0]).toHaveProperty('status');
    });
  });

  describe('createItem', () => {
    beforeEach(() => {
      itemRepository.create(Arg.any()).resolves({
        id: '1',
        name: 'Item 1',
        picture: 'test.png',
        status: 'DRAFT',
        catalogueItemId: '1',
      });
    });

    it('should create an item', async () => {
      const result = await itemService.createItem({
        name: 'Item 1',
        picture: 'test.png',
        status: 'AVAILABLE',
        catalogueItemId: '1',
      });
      itemRepository.received(1).create(Arg.any());
      expect(result).toBeDefined();
    });

    it('should return the correct item data structure', async () => {
      const result = await itemService.createItem({
        name: 'Item 1',
        picture: 'test.png',
        status: 'DRAFT',
        catalogueItemId: '1',
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('catalogueItemId');
      expect(result).toHaveProperty('picture');
      expect(result).toHaveProperty('status');
    });
  });

  describe('editItem', () => {
    beforeEach(() => {
      itemRepository.create(Arg.any()).resolves({
        id: '1',
        name: 'Item 1',
        picture: 'test.png',
        status: 'DRAFT',
        catalogueItemId: '1',
      });
    });

    it('should update an existing item', () => {
      const result = itemService.editItem({
        id: '1',
        name: 'Item 1',
        picture: 'test.png',
        status: 'DRAFT',
        catalogueItemId: '1',
      });
      itemRepository.received(1).update(Arg.any());
      expect(result).toBeDefined();
    });

    it('should return the correct item data structure', async () => {
      const result = await itemService.editItem({
        id: '1',
        name: 'Item 1',
        picture: 'test.png',
        status: 'DRAFT',
        catalogueItemId: '1',
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('catalogueItemId');
      expect(result).toHaveProperty('picture');
      expect(result).toHaveProperty('status');
    });
  });

  describe('deleteItem', () => {
    beforeEach(() => {
      itemRepository
        .delete({
          where: { id: '1' },
          include: { catalogueItem: { select: { name: true, id: true } } },
        })
        .resolves({
          id: '1',
          name: 'Item 1',
          picture: 'test.png',
          status: 'DRAFT',
          catalogueItemId: '1',
        });
    });

    it('should delete an existing item', async () => {
      const result = await itemService.deleteItem('1');
      itemRepository
        .received(1)
        .delete({ where: { id: '1' }, include: defaultInclude });
      expect(result).toBeDefined();
    });

    it('should return the correct item data structure', async () => {
      const result = await itemService.deleteItem('1');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('catalogueItemId');
      expect(result).toHaveProperty('picture');
      expect(result).toHaveProperty('status');
    });
  });
});
