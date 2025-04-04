import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(name: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { name } });
  }

  async createOne(userData: User): Promise<UserEntity> {
    const user = this.userRepository.create({
      ...userData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this.userRepository.save(user);
  }
}
