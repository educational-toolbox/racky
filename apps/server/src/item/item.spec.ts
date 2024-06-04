import { ItemService } from './item.service';

describe('getItemById', () => {
  // successfully retrieves an item by a valid ID
  it('should return the item when a valid ID is provided', async () => {
    const mockDatabaseService = {
      item: {
        findUnique: jest.fn().mockResolvedValue({ id: '1', name: 'Test Item' }),
      },
    };
    const itemService = new ItemService(mockDatabaseService as any);
    const result = await itemService.getItemById('1');
    expect(result).toEqual({ id: '1', name: 'Test Item' });
    expect(mockDatabaseService.item.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  // returns the correct item data structure
  it('should return the correct item data structure', async () => {
    const mockDatabaseService = {
      item: {
        findUnique: jest.fn().mockResolvedValue({
          id: '1',
          name: 'Test Item',
          status: 'available',
        }),
      },
    };
    const itemService = new ItemService(mockDatabaseService as any);
    const result = await itemService.getItemById('1');
    expect(result).toEqual({ id: '1', name: 'Test Item', status: 'available' });
  });

  // handles cases where the item exists in the database
  it('should handle existing item in the database', async () => {
    const mockDatabaseService = {
      item: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ id: '1', name: 'Existing Item' }),
      },
    };
    const itemService = new ItemService(mockDatabaseService as any);
    const result = await itemService.getItemById('1');
    expect(result).toEqual({ id: '1', name: 'Existing Item' });
  });

  // item ID does not exist in the database
  it('should return null when item ID does not exist in the database', async () => {
    const mockDatabaseService = {
      item: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    const itemService = new ItemService(mockDatabaseService as any);
    const result = await itemService.getItemById('nonexistent-id');
    expect(result).toBeNull();
  });

  // item ID is an empty string
  it('should return null when item ID is an empty string', async () => {
    const mockDatabaseService = {
      item: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    const itemService = new ItemService(mockDatabaseService as any);
    const result = await itemService.getItemById('');
    expect(result).toBeNull();
  });

  // item ID is a null value
  it('should return null when item ID is a null value', async () => {
    const mockDatabaseService = {
      item: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    const itemService = new ItemService(mockDatabaseService as any);
    const result = await itemService.getItemById('null');
    expect(result).toBeNull();
  });
});
