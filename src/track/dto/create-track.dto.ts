import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  artistId?: string | null; // refers to Artist

  @IsOptional()
  @IsUUID()
  albumId?: string | null; // refers to Album

  @IsNumber()
  duration: number;
}
