import { IsString } from 'class-validator';

export class MatchRequestDto {
  @IsString()
  date: string;

  @IsString()
  location: string;
}
