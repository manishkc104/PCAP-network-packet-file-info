import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { PacketService } from './packet.service';

@Controller('packets')
export class PacketsController {
  constructor(private packetService: PacketService) {}

  @Get()
  async getAllPacket(@Query() query) {
    const result = await this.packetService.getPacket(
      query.page,
      query.pageSize,
      query.searchTerm,
    );
    return result;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file uploaded'));
      }
      if (file.mimetype !== 'text/csv') {
        reject(new Error('Uploaded file is not a CSV'));
      }
      const csvString = file.buffer.toString();
      const stream = Readable.from([csvString]);
      const results = [];
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            const result = await this.packetService.uploadPacketDetail(results);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
