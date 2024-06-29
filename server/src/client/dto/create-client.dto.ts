import { IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  telegram_id: number;

  @IsString()
  username: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
