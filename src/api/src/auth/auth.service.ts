import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
  async createUser(data: Partial<User>) {
    const hashPassword = await bcrypt.hash(data.password!, 10);
    const user = this.userRepository.create({
      ...data,
      password: hashPassword,
    });
    return await this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const passwordMatches = await bcrypt.compare(password, user.password!);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
