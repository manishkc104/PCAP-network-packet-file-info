import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { PacketService } from './packet.service';
import { spawn } from 'child_process';

@Controller('packets')
export class PacketsController {
  constructor(private packetService: PacketService) {}

  @Get()
  async getAllPacket(@Query() query) {
    const result = await this.packetService.getPacketData(
      query.page,
      query.pageSize,
      query.searchTerm,
      query.isFlagged,
    );
    return result;
  }

  @Put('flaggedPacket')
  async updateflaggededPacket(@Body() packetIds: number[]) {
    const result = await this.packetService.updatedPackets(packetIds, true);
    return result;
  }

  @Put('unflaggedPacket')
  async updateUnflaggededPacket(@Body() packetIds: number[]) {
    const result = await this.packetService.updatedPackets(packetIds, false);
    return result;
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    try {
      const fileProcessing = files.map((file) => this.processFile(file));
      const results = await Promise.all(fileProcessing);
      return { success: true, results };
    } catch (error) {}
  }

  async processFile(file) {
    if (
      file.mimetype !== 'text/csv' &&
      file.mimetype !== 'application/octet-stream' &&
      file.mimetype !== 'application/vnd.tcpdump.pcap'
    ) {
      throw new BadRequestException('Uploaded file is not a CSV/PCAP file');
    }

    if (file.mimetype === 'text/csv') {
      const result = await this.processCSV(file);
      return result;
    } else {
      const result = await this.processPcap(file);
      return result;
    }
  }

  async processCSV(file) {
    return new Promise((resolve, reject) => {
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

  async processPcap(file) {
    console.log({ file });
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
}
