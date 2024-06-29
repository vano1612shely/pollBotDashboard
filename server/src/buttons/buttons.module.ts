import { Module } from '@nestjs/common';
import { ButtonsService } from './buttons.service';
import { ButtonsController } from './buttons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonEntity } from './entities/button.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ButtonEntity])],
  controllers: [ButtonsController],
  providers: [ButtonsService],
  exports: [ButtonsService],
})
export class ButtonsModule {}
