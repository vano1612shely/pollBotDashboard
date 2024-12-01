import { forwardRef, Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotEntity } from './entities/bot.entity';
import { StartHandler } from './handlers/start.handler';
import { ClientModule } from '../client/client.module';
import { MessagesModule } from '../messages/messages.module';
import { VerifyHandler } from './handlers/verify.handler';
import { CustomNameHandler } from './handlers/custom_name.handler';
import { PollHandler } from './handlers/poll.handler';
import { AdminHandler } from './handlers/admin.handler';
import { SendMessageScene } from './scenes/send_message.scene';
import { PollScene, PollScene2, PollSceneName } from './scenes/poll.scene';
import { ButtonsModule } from '../buttons/buttons.module';
import { CustomNameScene } from './scenes/custom_name.scene';
import { MessageHandler } from './handlers/message.handler';
import { ChatModule } from '../chat/chat.module';
import { SendedListEntity } from '../messages/entities/sendedList.entity';
import { MessageEntity } from '../messages/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BotEntity, SendedListEntity, MessageEntity]),
    ClientModule,
    MessagesModule,
    ButtonsModule,
    ChatModule,
  ],
  controllers: [BotsController],
  providers: [
    BotsService,
    StartHandler,
    VerifyHandler,
    CustomNameHandler,
    PollHandler,
    AdminHandler,
    SendMessageScene,
    PollScene,
    PollScene2,
    PollSceneName,
    CustomNameScene,
    MessageHandler,
  ],
  exports: [BotsService],
})
export class BotsModule {}
