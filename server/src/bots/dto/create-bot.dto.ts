import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBotDto {
  @IsString()
  token: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Transform(({ value, obj }) => {
    const raw = value ?? obj.chat_id;
    if (Array.isArray(raw)) {
      return raw.map((id) => `${id}`.trim()).filter((id) => id.length > 0);
    }
    if (typeof raw === 'string') {
      return raw
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
    }
    if (typeof raw === 'number') {
      return [`${raw}`];
    }
    return [];
  })
  chat_ids: string[];
}
