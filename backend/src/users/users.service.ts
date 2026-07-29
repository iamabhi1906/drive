import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id: Number(id) });
  }

  async create(user: DeepPartial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async deleteUser(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User with id:${id} not found`);
    return this.userRepository.remove(user);
  }

  async updateProfile(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async verifyEmail(email: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    user.isVerified = true;
    await this.userRepository.save(user);
  }
}
