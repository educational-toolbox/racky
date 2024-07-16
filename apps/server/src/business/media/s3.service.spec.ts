import { S3MediaService } from './s3.service';
import { getBucketParams } from './s3.client';
import * as AWS from '@aws-sdk/s3-request-presigner';

/**
 * We need to mock this because the S3MediaService depends on this client internally.
 * But we want to see that module methods have been called.
 */
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

/**
 * We need to mock this because the S3MediaService depends on this client internally.
 * But we want to see that client methods have been called.
 */
jest.mock('./s3.client', () => ({
  getBucketParams: jest.fn(),
}));

describe('S3MediaService tests', () => {
  let service: S3MediaService;

  beforeEach(() => {
    service = new S3MediaService();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.get()', () => {
    it('should call the client get method', async () => {
      // Arrange
      const fileId = 'test-key';
      const fileKey = `test-bucket/${fileId}`;
      (AWS.getSignedUrl as jest.Mock).mockResolvedValue(fileKey);
      // Act
      const data = await service.get(fileId);
      // Execute
      expect(AWS.getSignedUrl).toHaveBeenCalled();
      expect(data).toBeDefined();
      expect(data).toBe(fileKey);
    });
  });

  describe('.upload()', () => {
    it('should call the client upload method', async () => {
      // Arrange
      const fileId = 'test-key';
      const fileKey = `test-bucket/${fileId}`;
      (getBucketParams as jest.Mock).mockReturnValue({ Key: fileKey });
      // Act
      const data = await service.upload(fileId);
      // Execute
      expect(AWS.getSignedUrl).toHaveBeenCalled();
      expect(getBucketParams).toHaveBeenCalled();
      expect(data).toBeDefined();
      expect(data).toHaveProperty('url');
      expect(data).toHaveProperty('key');
      expect(data.key).toBe(fileKey);
    });
  });

  describe('.delete()', () => {
    it('should call the client delete method', async () => {
      // Arrange
      const fileId = 'test-key';
      const fileKey = `test-bucket/${fileId}`;
      (getBucketParams as jest.Mock).mockReturnValue({ Key: fileKey });
      // Act
      const data = await service.delete(fileId);
      // Execute
      expect(data).not.toBeDefined();
    });
  });
});
