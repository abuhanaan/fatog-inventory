import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminJwtAuthGuard } from 'src/auth/guards/admin-auth.guards';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthenticatedRequest } from 'src/utils/interfaces/authRequest.interface';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return new UserEntity(user);
  }

  @Get()
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get('/admin/dashboard')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Object })
  async dashboard() {
    const result = await this.usersService.adminDashboard();
    return new Object(result);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return new UserEntity(user);
  }

  @Patch(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return new UserEntity(user);
  }

  @Patch('/activate/:id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async activateUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.activateUser(id);
    return new UserEntity(user);
  }

  @Patch('deactivate/:id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async deactivateUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.deactivateUser(id);
    return new UserEntity(user);
  }

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Object })
  async changepassword(
    @Req() request: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = request.user as UserEntity;
    return this.usersService.changepassword(user, changePasswordDto);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.remove(id);
    return new UserEntity(user);
  }
}
