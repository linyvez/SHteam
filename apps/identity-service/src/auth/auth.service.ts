import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  private redisClient: Redis;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.redisClient = new Redis({
      host: 'redis',
      port: 6379,
    });
  }

  async register(email: string, pass: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    const user = await this.usersService.create(email, hashedPassword);

    return { id: user.id, email: user.email };
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    await this.redisClient.set(`session:${user.id}`, accessToken, 'EX', 3600);

    return {
      access_token: accessToken,
      user: { id: user.id, email: user.email },
    };
  }

  async logout(userId: string) {
    await this.redisClient.del(`session:${userId}`);
    return { message: 'Session destroyed successfully' };
  }

  async validate(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      const activeToken = await this.redisClient.get(`session:${userId}`);

      if (!activeToken || activeToken !== token) {
        throw new UnauthorizedException('Wrong token');
      }

      return { valid: true, user: payload };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async topUp(userId: string, amount: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.balance = Number(user.balance || 0) + Number(amount);

    await this.usersService.save(user);

    return { newBalance: user.balance };
  }
}
