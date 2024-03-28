import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  login: string;

  password: string;
}
