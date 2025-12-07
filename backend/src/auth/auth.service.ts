import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  async signUp(signUpDto: SignUpDto) {
    // TODO: Add database integration later
    // For now, just return success response
    return {
      message: 'User created',
    };
  }

  async signIn(signInDto: SignInDto) {
    // TODO: Add database and JWT authentication later
    // For now, just return success response
    return {
      message: 'Signed in successfully',
    };
  }
}

