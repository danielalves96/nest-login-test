import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

export const AwsS3Config = (configService: ConfigService) => ({
  s3: new S3({
    accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    region: configService.get<string>('AWS_REGION'),
  }),
  bucketName: configService.get<string>('AWS_S3_BUCKET_NAME'),
});
