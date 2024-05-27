import {
  BadRequestException,
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
import { spawn } from 'child_process';

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
      const pythonProcess = spawn('python', ['../analyze_pcap.py']);

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          return reject(
            new BadRequestException(
              `Python script exited with code ${code}: ${errorOutput}`,
            ),
          );
        }
        try {
          const formattedData = JSON.parse(output);
          const result =
            await this.packetService.uploadPacketDetail(formattedData);
          resolve(result);
        } catch (err) {
          reject(
            new BadRequestException(
              `Error parsing JSON output: ${err.message}`,
            ),
          );
        }
      });
      pythonProcess.stdin.write(file.buffer);
      pythonProcess.stdin.end();
    });
  }
  // return new Promise((resolve, reject) => {
  //   // if (!file) {
  //   //   reject(new Error('No file uploaded'));
  //   // }
  //   // if (file.mimetype !== 'text/csv') {
  //   //   reject(new Error('Uploaded file is not a CSV'));
  //   // }
  //   const csvString = file.buffer.toString();
  //   const stream = Readable.from([csvString]);
  //   const results = [];
  //   stream
  //     .pipe(csv())
  //     .on('data', (data) => results.push(data))
  //     .on('end', async () => {
  //       try {
  //         const result = await this.packetService.uploadPacketDetail(results);
  //         resolve(result);
  //       } catch (error) {
  //         reject(error);
  //       }
  //     })
  //     .on('error', (error) => {
  //       reject(error);
  //     });
  // });
}
