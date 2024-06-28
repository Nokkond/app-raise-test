import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    protected userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { supervisorId } = createUserDto;
    let supervisor = null;

    if (supervisorId) {
      supervisor = await this.userRepository.findOne({ where: { id: supervisorId } });
      if (!supervisor) {
        throw new Error('Supervisor not found');
      }
    }

    const user = this.userRepository.create(createUserDto);
    user.supervisor = supervisor;

    return this.userRepository.save(user);
  }

  async update(id: number, supervisorId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['subordinates', 'supervisor'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    const newSupervisor = await this.userRepository.findOne({
      where: { id: supervisorId },
    });

    if (!newSupervisor) {
      throw new Error('New supervisor not found');
    }

    const supervisor = user.supervisor;
    if (user.subordinates.length > 0) {
      for (const subordinate of user.subordinates) {
        subordinate.supervisor = supervisor;
        await this.userRepository.save(subordinate);
      }
    }

    await this.userRepository.save({...user, supervisor: newSupervisor, subordinates: []});
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['subordinates', 'supervisor'] });
    if (!user) {
      throw new Error('User not found');
    }
    
    const supervisor = user.supervisor;
    if (user.subordinates.length > 0) {
      for (const subordinate of user.subordinates) {
        subordinate.supervisor = supervisor;
        await this.userRepository.save(subordinate);
      }
    }

    await this.userRepository.remove(user);
  }

  async getTree(): Promise<any> {
    //@ts-ignore
    return this.userRepository.findTrees();
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}