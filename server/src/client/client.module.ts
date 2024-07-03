import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { ResultsEntity } from '../messages/entities/results.entity';
import { ChatEntity } from '../chat/entities/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity, ResultsEntity, ChatEntity]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
