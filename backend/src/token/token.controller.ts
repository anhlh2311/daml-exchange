import { Controller, Get, Post, Body, Param, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { DamlService } from '../daml/daml.service';

@ApiTags('tokens')
@Controller('api/tokens')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly damlService: DamlService
  ) {}

  @Get('ledgers')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Get all token ledgers' })
  @ApiResponse({ status: 200, description: 'Token ledgers retrieved successfully' })
  async getTokenLedgers() {
    try {
      // For testing, use a hardcoded DAML token with the correct ledger ID
      // In production, you would get this from the auth service
      // This token is for user 'Alice' on ledger 'sandbox'
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';
      
      const ledgers = await this.tokenService.getTokenLedgers(damlToken);
      return { ledgers };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch token ledgers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('masters')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Get all token masters' })
  @ApiResponse({ status: 200, description: 'Token masters retrieved successfully' })
  async getTokenMasters() {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';
      
      const masters = await this.tokenService.getTokenMasters(damlToken);
      return { masters };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch token masters',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('transfer-locks')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Get all token transfer locks' })
  @ApiResponse({ status: 200, description: 'Token transfer locks retrieved successfully' })
  async getTokenTransferLocks() {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';
      
      const locks = await this.tokenService.getTokenTransferLocks(damlToken);
      return { locks };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch token transfer locks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('setup')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Create a new token setup' })
  @ApiResponse({ status: 201, description: 'Token setup created successfully' })
  async createTokenSetup(
    @Body() payload: { owner: string; initialSupply: number; metadata: any; observers: string[] },
  ) {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';
      
      const result = await this.tokenService.createTokenSetup(damlToken, payload);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create token setup',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('setup/:contractId/initialize')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Initialize a token from setup' })
  @ApiResponse({ status: 200, description: 'Token initialized successfully' })
  async initializeToken(
    @Param('contractId') contractId: string,
  ) {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';

      const result = await this.tokenService.initializeToken(damlToken, contractId);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to initialize token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('masters/:contractId/mint')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Mint new tokens' })
  @ApiResponse({ status: 200, description: 'Tokens minted successfully' })
  async mintTokens(
    @Param('contractId') contractId: string,
    @Body() payload: { amount: number },
  ) {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';

      const result = await this.tokenService.mintTokens(damlToken, contractId, payload.amount);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to mint tokens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('masters/:contractId/lock-transfer')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Lock tokens for transfer' })
  @ApiResponse({ status: 200, description: 'Tokens locked for transfer successfully' })
  async lockTokensForTransfer(
    @Param('contractId') contractId: string,
    @Body() payload: { recipient: string; transferAmount: number },
  ) {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';

      const result = await this.tokenService.lockTokensForTransfer(
        damlToken,
        contractId,
        payload.recipient,
        payload.transferAmount,
      );
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to lock tokens for transfer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('transfer-locks/:contractId/accept')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Accept a token transfer' })
  @ApiResponse({ status: 200, description: 'Token transfer accepted successfully' })
  async acceptTransfer(
    @Param('contractId') contractId: string,
  ) {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';

      const result = await this.tokenService.acceptTransfer(damlToken, contractId);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to accept transfer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('transfer-locks/:contractId/reject')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Reject a token transfer' })
  @ApiResponse({ status: 200, description: 'Token transfer rejected successfully' })
  async rejectTransfer(
    @Param('contractId') contractId: string,
  ) {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';

      const result = await this.tokenService.rejectTransfer(damlToken, contractId);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to reject transfer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('transfer-locks/:contractId/cancel')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Cancel a token transfer' })
  @ApiResponse({ status: 200, description: 'Token transfer cancelled successfully' })
  async cancelTransfer(
    @Param('contractId') contractId: string,
  ) {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';

      const result = await this.tokenService.cancelTransfer(damlToken, contractId);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to cancel transfer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('masters/:masterContractId/burn')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Burn tokens' })
  @ApiResponse({ status: 200, description: 'Tokens burned successfully' })
  async burnTokens(
    @Param('masterContractId') masterContractId: string,
    @Body() payload: { tokenCid: string; amountToBurn?: number },
  ) {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';

      const result = await this.tokenService.burnTokens(
        damlToken,
        masterContractId,
        payload.tokenCid,
        payload.amountToBurn,
      );
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to burn tokens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('test-template/:templateId')
  @ApiOperation({ summary: 'Test fetching any contract template' })
  @ApiResponse({ status: 200, description: 'Contracts retrieved successfully' })
  async testGetContracts(@Param('templateId') templateId: string) {
    try {
      // Use the same hardcoded DAML token for testing
      const damlToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6ImRhbWwtZXhjaGFuZ2UtYmFja2VuZCIsImFjdEFzIjpbIkFsaWNlIl19fQ.Cj0dGxR0gZpwW5yR7jHNvqOzjEKjC5Mwvtk_6iNO-GQ';

      // Use the DamlService directly to fetch any template
      const contracts = await this.damlService.getActiveContracts(damlToken, templateId);
      return { 
        templateId,
        count: contracts.length,
        contracts 
      };
    } catch (error) {
      throw new HttpException(
        error.message || `Failed to fetch contracts for template ${templateId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
