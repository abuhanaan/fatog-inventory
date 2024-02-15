import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Staff } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class StaffsService {
  constructor(private prisma: PrismaService) {}

  private checkIfStaffExists(staff: Staff, id: number) {
    if (!staff) {
      throw new NotFoundException({
        message: `User with id ${id} does not have a Staff Profile`,
        error: 'Not Found',
      });
    }
  }
  async create(createStaffDto: CreateStaffDto) {
    const existingStaff = await this.prisma.staff.findUnique({
      where: { staffId: createStaffDto.staffId },
    });
    if (existingStaff) {
      throw new ConflictException({
        message: `Staff with Id ${createStaffDto.staffId} already have a staff profile`,
        error: 'Conflict Operation',
      });
    }
    return this.prisma.staff.create({ data: createStaffDto });
  }

  async findAll() {
    const staffs = await this.prisma.staff.findMany({
      include: { sales: true },
    });
    return staffs;
  }

  async findOne(id: number) {
    const staff = await this.prisma.staff.findUnique({ where: { id } });
    this.checkIfStaffExists(staff, id);
    return staff;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto, user: UserEntity) {
    if (id !== user.id) {
      throw new UnauthorizedException({
        message: "You are not Authorised to update someone else's profile",
        error: 'Unauthorised',
      });
    }
    const staff = await this.prisma.staff.findUnique({ where: { id } });
    this.checkIfStaffExists(staff, id);
    return this.prisma.staff.update({
      where: { staffId: id },
      data: updateStaffDto,
    });
  }

  async remove(id: number) {
    const staff = await this.prisma.staff.findUnique({
      where: { staffId: id },
    });
    this.checkIfStaffExists(staff, id);
    return this.prisma.staff.delete({ where: { staffId: id } });
  }
}
