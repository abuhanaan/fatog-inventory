import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class ChangePasswordDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'role', 'active', 'category']),
) {}
