import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly httpBaseUrl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('daml.ledger.host');
    const httpPort = this.configService.get<number>('daml.ledger.httpPort');
    this.httpBaseUrl = `http://${host}:${httpPort}`;
  }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      // In a real application, you would validate against a user database
      // For development, we'll allow any username with password 'secret'
      if (password === 'secret') {
        // For development, we'll create a mock DAML token
        // In production, you would get this from the DAML ledger
        const mockToken = this.jwtService.sign({ 
          "https://daml.com/ledger-api": {
            "ledgerId": "sandbox", // Use the correct ledger ID
            "applicationId": "daml-exchange-backend",
            "actAs": [username]
          }
        });
        
        return { username, token: mockToken };
      }
      return null;
    } catch (error) {
      this.logger.error('Error validating user:', error.message);
      return null;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      daml_token: user.token,
      username: user.username,
    };
  }

  async getDamlToken(party: string): Promise<string | null> {
    try {
      // Call the DAML JSON API token endpoint to get a token for this party
      const response = await axios.post(`${this.httpBaseUrl}/v1/token`, {
        party,
      });
      
      if (response.status === 200 && response.data.token) {
        return response.data.token;
      }
      
      return null;
    } catch (error) {
      this.logger.error(`Error getting DAML token for party ${party}:`, error.message);
      return null;
    }
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
