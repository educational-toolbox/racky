import * as aws from '@aws-sdk/client-s3';
import { env } from '../../server-env';

export const s3client = new aws.S3({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const getBucketParams = (id: string, contentType = 'image/*') => ({
  Bucket: env.AWS_BUCKET_NAME,
  Key: `${env.AWS_S3_BUCKET_KEY}/${id}/${Date.now() + Math.random()}`,
  ContentType: contentType,
});
