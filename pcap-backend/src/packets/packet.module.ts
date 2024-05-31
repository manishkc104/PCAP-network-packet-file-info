import { TypeOrmModule } from '@nestjs/typeorm';
import { PacketService } from './packet.service';
import { PacketsController } from './packets.controller';
import { Module } from '@nestjs/common';
import { Packet } from 'src/entities/Packet';

@Module({
  imports: [TypeOrmModule.forFeature([Packet])],
  controllers: [PacketsController],
  providers: [PacketService],
})
export class PacketModule {}
