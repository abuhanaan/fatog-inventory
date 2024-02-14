import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  private checkIfUserExists(user: User, id: number) {
    if (!user) {
      throw new NotFoundException({
        message: 'Not Found',
        error: `User with id ${id} does not exist`,
      });
    }
  }
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException({
          message: 'Conflict Operation',
          error: `User with email ${createUserDto.email} already exist`,
        });
      }
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        roundsOfHashing,
      );

      createUserDto.password = hashedPassword;
      const newUser = await this.prisma.user.create({ data: createUserDto });

      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async adminDashboard() {
    return {};
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    this.checkIfUserExists(user, id);
    return user;
  }

  async changepassword(user: UserEntity, changePasswordDto: ChangePasswordDto) {
    try {
      await this.update(user.id, changePasswordDto);
      return { status: true, message: 'Password changed Successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async activateUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    this.checkIfUserExists(user, id);

    return this.prisma.user.update({ where: { id }, data: { active: true } });
  }

  async deactivateUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    this.checkIfUserExists(user, id);

    return this.prisma.user.update({ where: { id }, data: { active: false } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    this.checkIfUserExists(user, id);
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
      updateUserDto.password = hashedPassword;
    }

    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    this.checkIfUserExists(user, id);
    return this.prisma.user.delete({ where: { id } });
  }
}
