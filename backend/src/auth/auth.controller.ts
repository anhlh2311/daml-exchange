import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Login with party name to get JWT and DAML tokens' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('token')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Get a DAML token for a party' })
  @ApiResponse({ status: 200, description: 'Token generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid party name' })
  async getDamlToken(@Body() body: { party: string }) {
    const token = await this.authService.getDamlToken(body.party);
    if (!token) {
      throw new HttpException('Failed to get token for party', HttpStatus.BAD_REQUEST);
    }
    return { token };
  }
}
