import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateButtonDto {
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  buttons: any[][];
}
