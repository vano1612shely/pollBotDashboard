import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { ResultsEntity } from './entities/results.entity';
import { BotsModule } from '../bots/bots.module';
import { ClientModule } from '../client/client.module';
import {SendedListEntity} from "./entities/sendedList.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, ResultsEntity, SendedListEntity]),
    forwardRef(() => BotsModule),
    ClientModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
