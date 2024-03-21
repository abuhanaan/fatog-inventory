import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StaffEntity } from './entities/staff.entity';
import { AuthenticatedRequest } from 'src/utils/interfaces/authRequest.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('staffs')
@ApiTags('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  // @Post()
  // @ApiCreatedResponse({ type: StaffEntity })
  // async create(@Body() createStaffDto: CreateStaffDto) {
  //   const newStaff = await this.staffsService.create(createStaffDto);
  //   return new StaffEntity(newStaff);
  // }

  @Get('dashboard')
  dashboard() {}

  @Get('my-sales')
  orders() {}
  @Get()
  @ApiOkResponse({ type: StaffEntity, isArray: true })
  async findAll() {
    const staffs = await this.staffsService.findAll();
    return staffs.map((staff) => new StaffEntity(staff));
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: StaffEntity })
  async findOne(
    // @Param('userId', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const user = request.user as UserEntity;
    const staff = await this.staffsService.findOne(user.id);
    return new StaffEntity(staff);
  }

  @Patch('/profile-update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: StaffEntity })
  async update(
    // @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    const user = request.user as UserEntity;
    console.log({ user });
    const staff = await this.staffsService.update(updateStaffDto, user);
    return new StaffEntity(staff);
  }

  @Delete(':id')
  @ApiOkResponse({ type: StaffEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const staff = await this.staffsService.remove(id);
    return new StaffEntity(staff);
  }
}
