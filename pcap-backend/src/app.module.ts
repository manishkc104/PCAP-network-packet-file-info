import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacketModule } from './packets/packet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Packet } from './entities/Packet';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'sqlite',
        host: 'localhost',
        port: 5432,
        username: '',
        password: '',
        database: './pcapData/pcapData.sqlite',
        entities: [Packet],
        synchronize: true,
      }),
    }),
    PacketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
