import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly s3: S3;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    username: string,
  ): Promise<string> {
    const date = new Date().toISOString().split('T')[0];
    const originalName = path.basename(
      file.originalname,
      path.extname(file.originalname),
    );
    const ext = path.extname(file.originalname);
    const key = `${username}-${userId}-${date}-${originalName}${ext}`;

    if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext.toLowerCase())) {
      throw new BadRequestException('Tipo de arquivo não suportado');
    }

    try {
      await this.deleteFilesWithUserId(userId);

      console.log(`Uploading file: ${key}`);
      await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();

      console.log('File uploaded successfully:', key);

      const signedUrl = this.s3.getSignedUrl('getObject', {
        Bucket: this.bucketName,
        Key: key,
        Expires: 315360000,
      });

      console.log('Generated signed URL:', signedUrl);
      return signedUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new InternalServerErrorException('Erro ao fazer upload do arquivo');
    }
  }

  async deleteFilesWithUserId(userId: string): Promise<void> {
    try {
      const listParams = {
        Bucket: this.bucketName,
      };

      const listedObjects = await this.s3.listObjectsV2(listParams).promise();

      if (!listedObjects.Contents || listedObjects.Contents.length === 0)
        return;

      const deleteParams = {
        Bucket: this.bucketName,
        Delete: { Objects: [] },
      };

      listedObjects.Contents.forEach(({ Key }) => {
        if (Key.includes(userId)) {
          deleteParams.Delete.Objects.push({ Key });
        }
      });

      if (deleteParams.Delete.Objects.length > 0) {
        await this.s3.deleteObjects(deleteParams).promise();
        console.log('Files deleted successfully with userId:', userId);
      }
    } catch (error) {
      console.error('Error deleting files with userId:', error);
      throw new BadRequestException('Erro ao deletar arquivos com userId');
    }
  }
}
