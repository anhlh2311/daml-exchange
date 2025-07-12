import { Controller, Get, Post, Body, Param, UseGuards, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { DamlService } from './daml.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('daml')
@Controller('api/daml')
export class DamlController {
  constructor(private readonly damlService: DamlService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check DAML ledger connection health' })
  @ApiResponse({ status: 200, description: 'DAML ledger is connected' })
  @ApiResponse({ status: 503, description: 'DAML ledger is not connected' })
  async checkHealth() {
    const isConnected = await this.damlService.checkLedgerConnection();
    if (!isConnected) {
      throw new HttpException('DAML ledger is not connected', HttpStatus.SERVICE_UNAVAILABLE);
    }
    return { status: 'ok', message: 'DAML ledger is connected' };
  }

  @Get('parties')
  @ApiOperation({ 
    summary: 'Get list of parties with hardcoded token',
    description: 'Returns the list of parties visible to the hardcoded token with ledger ID "sandbox".'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of parties',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        ledgerId: { type: 'string', example: 'sandbox' },
        parties: { 
          type: 'array', 
          items: {
            type: 'object',
            properties: {
              displayName: { type: 'string', example: 'Alice' },
              identifier: { type: 'string', example: 'Alice::12345...' },
              isLocal: { type: 'boolean', example: true }
            }
          }
        },
        status: { type: 'string', example: 'Parties retrieved successfully' }
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Failed to retrieve parties' })
  async getParties() {
    try {
      // Use a hardcoded DAML token for verification
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';
      
      const result = await this.damlService.getParties(damlToken);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve parties',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
  @Get('parties/authenticated')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get list of parties with authentication',
    description: 'Returns the list of parties visible to the authenticated user.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of parties',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        ledgerId: { type: 'string', example: 'sandbox' },
        parties: { 
          type: 'array', 
          items: {
            type: 'object',
            properties: {
              displayName: { type: 'string', example: 'Alice' },
              identifier: { type: 'string', example: 'Alice::12345...' },
              isLocal: { type: 'boolean', example: true }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Failed to retrieve parties' })
  async getPartiesAuthenticated(@Headers('authorization') authorization: string) {
    try {
      // Extract token from Authorization header
      const token = authorization?.replace('Bearer ', '') || '';
      if (!token) {
        throw new HttpException('Authorization token is required', HttpStatus.UNAUTHORIZED);
      }
      
      const result = await this.damlService.getParties(token);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve parties',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('ledger-id')
  @ApiOperation({ summary: 'Get DAML ledger ID' })
  @ApiResponse({ status: 200, description: 'Ledger ID retrieved successfully' })
  async getLedgerId() {
    try {
      const ledgerId = await this.damlService.getLedgerId();
      return { ledgerId };
    } catch (error) {
      throw new HttpException('Failed to get ledger ID', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('contracts/:templateId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active contracts for a template' })
  @ApiResponse({ status: 200, description: 'Active contracts retrieved successfully' })
  async getActiveContracts(
    @Headers('authorization') authorization: string,
    @Param('templateId') templateId: string,
  ) {
    try {
      // Extract token from Authorization header
      const token = authorization?.replace('Bearer ', '') || '';
      if (!token) {
        throw new HttpException('Authorization token is required', HttpStatus.UNAUTHORIZED);
      }

      const contracts = await this.damlService.getActiveContracts(token, templateId);
      return { contracts };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch active contracts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('contracts/:templateId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({ status: 201, description: 'Contract created successfully' })
  async createContract(
    @Headers('authorization') authorization: string,
    @Param('templateId') templateId: string,
    @Body() payload: any,
  ) {
    try {
      // Extract token from Authorization header
      const token = authorization?.replace('Bearer ', '') || '';
      if (!token) {
        throw new HttpException('Authorization token is required', HttpStatus.UNAUTHORIZED);
      }

      const result = await this.damlService.createContract(token, templateId, payload);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create contract',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('contracts/:contractId/exercise/:choice')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exercise a choice on a contract' })
  @ApiResponse({ status: 200, description: 'Choice exercised successfully' })
  async exerciseChoice(
    @Headers('authorization') authorization: string,
    @Param('contractId') contractId: string,
    @Param('choice') choice: string,
    @Body() argument: any,
  ) {
    try {
      // Extract token from Authorization header
      const token = authorization?.replace('Bearer ', '') || '';
      if (!token) {
        throw new HttpException('Authorization token is required', HttpStatus.UNAUTHORIZED);
      }

      const result = await this.damlService.exerciseChoice(token, contractId, choice, argument);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to exercise choice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
