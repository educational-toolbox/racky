/* eslint-disable @typescript-eslint/unbound-method */
import { Logger } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Request } from 'express';
import { ClerkAuthService } from './clerk-auth.service';

jest.mock('./clerk-client', () => ({
  clerkClient: {
    verifyToken: jest.fn(),
  },
}));

import { clerkClient } from './clerk-client';

describe('ClerkAuthService', () => {
  let service: ClerkAuthService;
  let logger: Logger;
  let request: Request;

  beforeEach(async () => {
    logger = new Logger();
    jest.spyOn(logger, 'error').mockImplementation(() => {
      // Do nothing
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClerkAuthService,
        {
          provide: Logger,
          useValue: logger,
        },
      ],
    }).compile();

    service = module.get<ClerkAuthService>(ClerkAuthService);
    request = {
      headers: {},
      cookies: {},
    } as Request;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.validate()', () => {
    it('emty request should return false', async () => {
      // Act
      const result = await service.validate(request);
      // Execute
      expect(result).toBeFalsy();
    });

    it('invalid JWT from headers should log an error', async () => {
      // Arrange
      request.headers = {
        authorization: 'Bearer invalid-jwt.token.here',
      };
      // Act
      const result = await service.validate(request);
      // Execute
      expect(result).toBeFalsy();
      expect(logger.error).toHaveBeenCalled();
    });

    it('invalid JWT from cookie should return true', async () => {
      // Arrange
      request.cookies = {
        __session: 'invalid-jwt.token.here',
      };
      // Act
      const result = await service.validate(request);
      // Execute
      expect(result).toBeFalsy();
      expect(logger.error).toHaveBeenCalled();
    });

    it('valid JWT from headers should return true', async () => {
      (clerkClient.verifyToken as jest.Mock).mockResolvedValue({
        exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
        nbf: Math.floor(Date.now() / 1000) - 3600, // Valid from 1 hour ago
      });

      request.headers = {
        authorization: 'Bearer valid-jwt.token.here',
      };

      // Act
      const result = await service.validate(request);

      // Execute
      expect(result).toBeTruthy();
      expect(clerkClient.verifyToken).toHaveBeenCalled();
    });
  });

  describe('.authenticate()', () => {
    it('Should throw as it is handled by a third party', async () => {
      // Act
      await expect(async () => {
        await service.authenticate();
      }).rejects.toThrow();
      // Execute
    });
  });
});
