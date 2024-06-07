import { Injectable, Logger } from '@nestjs/common';
import { MediaService } from './media.service';
import { getBucketParams, s3client } from './s3.client';
import * as s3RequestPresigner from '@aws-sdk/s3-request-presigner';
import * as aws from '@aws-sdk/client-s3';
import { env } from '../server-env';

@Injectable()
export class S3MediaService implements MediaService {
  private logger = new Logger(S3MediaService.name);

  async get(fileKey: string): Promise<string> {
    const params = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: fileKey,
    };
    const command = new aws.GetObjectCommand(params);
    return await s3RequestPresigner.getSignedUrl(s3client, command, {
      expiresIn: 300,
    });
  }

  async upload(fileId: string): Promise<{
    url: string;
    key: string;
  }> {
    const params = getBucketParams(fileId);
    const url = await s3RequestPresigner.getSignedUrl(
      s3client,
      new aws.PutObjectCommand(params),
      {
        expiresIn: 60,
      },
    );
    return { url, key: params.Key };
  }

  async delete(fileKey: string): Promise<void> {
    this.logger.log(`Deleting file: ${fileKey}`);
  }
}
