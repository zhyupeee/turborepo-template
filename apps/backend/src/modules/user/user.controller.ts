import { Controller } from '@nestjs/common';
import { TypedRoute, TypedBody, TypedParam } from '@nestia/core';
import { UserService } from './user.service';
import { User } from './user.entity';

/**
 * 用户响应类型（不包含密码字段）
 */
interface UserResponse {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  avatar?: string;
}

interface UpdateUserDto {
  username?: string;
  avatar?: string;
  isActive?: boolean;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Post()
  async create(@TypedBody() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.userService.create(createUserDto) as Promise<UserResponse>;
  }

  @TypedRoute.Get()
  async findAll(): Promise<UserResponse[]> {
    return this.userService.findAll() as Promise<UserResponse[]>;
  }

  @TypedRoute.Get(':id')
  async findOne(@TypedParam('id') id: string): Promise<UserResponse> {
    return this.userService.findOne(id) as Promise<UserResponse>;
  }

  @TypedRoute.Put(':id')
  async update(
    @TypedParam('id') id: string,
    @TypedBody() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.userService.update(id, updateUserDto) as Promise<UserResponse>;
  }

  @TypedRoute.Delete(':id')
  async remove(@TypedParam('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
