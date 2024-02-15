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
} from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StaffEntity } from './entities/staff.entity';
import { AuthenticatedRequest } from 'src/utils/interfaces/authRequest.interface';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('staffs')
@ApiTags('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Post()
  @ApiCreatedResponse({ type: StaffEntity })
  async create(@Body() createStaffDto: CreateStaffDto) {
    const newStaff = await this.staffsService.create(createStaffDto);
    return new StaffEntity(newStaff);
  }

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

  @Get(':id')
  @ApiOkResponse({ type: StaffEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const staff = await this.staffsService.findOne(id);
    return new StaffEntity(staff);
  }

  @Patch(':id')
  @ApiOkResponse({ type: StaffEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    const user = request.user as UserEntity;
    const staff = await this.staffsService.update(id, updateStaffDto, user);
    return new StaffEntity(staff);
  }

  @Delete(':id')
  @ApiOkResponse({ type: StaffEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const staff = await this.staffsService.remove(id);
    return new StaffEntity(staff);
  }
}
