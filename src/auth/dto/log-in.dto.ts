import { PartialType } from '@nestjs/swagger';
import { SignUpDto } from './sign-up.dto';

export class LogInDto extends PartialType(SignUpDto) {}
