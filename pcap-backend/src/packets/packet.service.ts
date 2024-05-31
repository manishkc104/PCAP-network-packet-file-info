import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageDTO } from 'src/dto/page.dto';
import { Packet } from 'src/entities/Packet';
import { In, Repository } from 'typeorm';

@Injectable()
export class PacketService {
  constructor(
    @InjectRepository(Packet) private packetRepository: Repository<Packet>,
  ) {}

  async updatedPackets(packetIds: number[], isFlagged: boolean) {
    const queryBuilder = this.packetRepository.createQueryBuilder('packets');
    const result = await queryBuilder
      .update(Packet)
      .set({ isFlagged })
      .where({ id: In(packetIds) })
      .execute();
    return result;
  }

  async getPacketData(
    page: number,
    pageSize: number,
    searchTerm: string,
    isFlagged?: string,
  ) {
    const offset = (page - 1) * pageSize;
    const booleanIsFlagged = isFlagged === 'true' ? true : false;
    const queryBuilder = this.packetRepository.createQueryBuilder('packets');
    if (searchTerm) {
      queryBuilder.where(
        'packets.source LIKE :searchTerm OR packets.destination LIKE :searchTerm',
        { searchTerm: `%${searchTerm}%` },
      );
    }
    if (booleanIsFlagged) {
      queryBuilder.where({ isFlagged: booleanIsFlagged });
    }
    queryBuilder
      .orderBy('packets.createdAt', 'ASC')
      .skip(offset)
      .take(pageSize);
    const itemCount = await queryBuilder.getCount();
    const data = await queryBuilder.getMany();
    const pageOptionsDto = {
      skip: offset,
      page: page,
      take: pageSize,
    };
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    const pageDto = new PageDTO(data, pageMetaDto);
    return pageDto;
  }

  async uploadPacketDetail(packetDetail: any) {
    const packets = packetDetail.map((packetInfo) => {
      const packet = new Packet();
      packet.time = packetInfo.Time;
      packet.source = packetInfo.Source;
      packet.destination = packetInfo.Destination;
      packet.protocol = packetInfo.Protocol;
      packet.length = packetInfo.Length;
      packet.info = packetInfo.Info;
      packet.isFlagged = false;
      packet.createdAt = new Date();
      return packet;
    });
    const result = await this.packetRepository.save(packets);
    return result;
  }
}
