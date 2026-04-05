import { User } from './user.entity';

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  avatar?: string;
}

export interface UpdateUserDto {
  username?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export { User };
