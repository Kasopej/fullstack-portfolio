import { Body, Controller, Post } from '@nestjs/common';
import { PasswordLoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  passwordLogin(@Body() body: PasswordLoginDto) {
    return this.authService.signInWithPassword(body);
  }
}
