# DAML Token Exchange: Architecture Documentation

This document outlines the architecture decisions for the DAML Token Exchange project, including the relationships between DAML, NestJS backend, and Next.js frontend.

## Table of Contents

- [System Architecture](#system-architecture)
- [Component Breakdown](#component-breakdown)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Authentication Flow](#authentication-flow)
- [Development Guidelines](#development-guidelines)

## System Architecture

```
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│                │      │                │      │                │
│    Next.js     │ HTTP │     NestJS     │ DAML │     DAML       │
│    Frontend    │──────▶     Backend    │──────▶    Ledger      │
│                │      │                │      │                │
└────────────────┘      └────────────────┘      └────────────────┘
        │                       │                       │
        │                       │                       │
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│   TypeScript   │      │   TypeScript   │      │     DAML       │
│    Models      │      │ Models & DTOs  │      │   Templates    │
└────────────────┘      └────────────────┘      └────────────────┘
```

Our architecture follows a three-tier design with clear separation of concerns:

1. **Frontend Layer**: Next.js application with Tailwind CSS for UI
2. **Backend Layer**: NestJS application providing RESTful APIs
3. **DAML Layer**: DAML templates and workflows on the ledger

## Component Breakdown

### Frontend Components (Next.js)

- **Pages**: Route-based components for different views
- **Components**: Reusable UI elements
- **Hooks**: Custom React hooks for data fetching and state management
- **Services**: API client services for communicating with the backend
- **Types**: TypeScript interfaces matching backend DTOs

### Backend Components (NestJS)

- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic and communicate with DAML
- **DTOs**: Data Transfer Objects for API requests/responses
- **DAML Integration**: Services that interact with the DAML ledger
- **Auth**: Authentication and authorization middleware

### DAML Components

- **Templates**: Define contract structures (TokenLedger, TokenMaster, etc.)
- **Choices**: Actions that can be performed on contracts
- **Scripts**: Setup and testing scripts
- **Workflows**: Implemented business processes (token issuance, swaps, etc.)

## Data Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │ Next.js  │     │  NestJS  │     │  DAML    │
│ Browser  │     │ Frontend │     │ Backend  │     │ Ledger   │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │  HTTP Request  │                │                │
     │───────────────▶│                │                │
     │                │                │                │
     │                │  API Request   │                │
     │                │───────────────▶│                │
     │                │                │                │
     │                │                │  DAML Command  │
     │                │                │───────────────▶│
     │                │                │                │
     │                │                │  DAML Result   │
     │                │                │◀───────────────│
     │                │                │                │
     │                │  API Response  │                │
     │                │◀───────────────│                │
     │                │                │                │
     │  HTTP Response │                │                │
     │◀───────────────│                │                │
     │                │                │                │
```

1. User interacts with the Next.js frontend
2. Frontend makes HTTP requests to NestJS backend API endpoints
3. NestJS backend processes requests and interacts with DAML ledger
4. DAML ledger executes commands and returns results
5. Results flow back through the stack to the user

## Technology Stack

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Build Tools**: Webpack (via Next.js)

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **API Style**: RESTful
- **DAML Integration**: DAML JSON API client
- **Authentication**: JWT

### DAML
- **Language**: DAML
- **API**: JSON API
- **Templates**: TokenLedger, TokenMaster, SwapRequest, etc.

## Frontend Architecture

The Next.js frontend follows a feature-based architecture:

```
frontend/
├── components/
│   ├── common/           # Shared UI components
│   ├── layout/           # Layout components
│   ├── tokens/           # Token-related components
│   └── exchange/         # Exchange-related components
├── hooks/
│   ├── api/              # API hooks
│   └── state/            # State management hooks
├── pages/
│   ├── api/              # API routes
│   ├── tokens/           # Token pages
│   ├── exchange/         # Exchange pages
│   ├── _app.tsx          # App entry point
│   └── index.tsx         # Home page
├── public/               # Static assets
├── services/
│   ├── api.ts            # API client
│   └── auth.ts           # Auth service
├── styles/
│   └── globals.css       # Global styles
├── types/
│   ├── api.ts            # API types
│   └── models.ts         # Domain models
└── utils/                # Utility functions
```

### Key Frontend Patterns

1. **API Service Layer**:
   ```typescript
   // services/api.ts
   export class ApiService {
     static async getTokenBalances(): Promise<TokenBalance[]> {
       const response = await fetch('/api/tokens/balances');
       return response.json();
     }
   }
   ```

2. **React Query for Data Fetching**:
   ```typescript
   // hooks/api/useTokenBalances.ts
   import { useQuery } from 'react-query';
   import { ApiService } from '../../services/api';
   
   export function useTokenBalances() {
     return useQuery('tokenBalances', ApiService.getTokenBalances);
   }
   ```

3. **Component Structure**:
   ```typescript
   // components/tokens/TokenBalanceCard.tsx
   import { useTokenBalances } from '../../hooks/api/useTokenBalances';
   
   export function TokenBalanceCard() {
     const { data, isLoading } = useTokenBalances();
     
     if (isLoading) return <div>Loading...</div>;
     
     return (
       <div className="p-4 bg-white rounded shadow">
         {data.map(token => (
           <div key={token.id} className="flex justify-between py-2">
             <span>{token.symbol}</span>
             <span>{token.amount}</span>
           </div>
         ))}
       </div>
     );
   }
   ```

## Backend Architecture

The NestJS backend follows a modular architecture:

```
backend/
├── src/
│   ├── auth/             # Authentication module
│   ├── common/           # Shared utilities
│   ├── config/           # Configuration
│   ├── daml/             # DAML integration
│   │   ├── client.ts     # DAML client
│   │   └── services/     # DAML services
│   ├── tokens/           # Token module
│   │   ├── controllers/  # Token controllers
│   │   ├── dto/          # Token DTOs
│   │   └── services/     # Token services
│   ├── exchange/         # Exchange module
│   ├── app.module.ts     # App module
│   └── main.ts           # Entry point
└── test/                 # Tests
```

### Key Backend Patterns

1. **DAML Client Service**:
   ```typescript
   // src/daml/client.ts
   @Injectable()
   export class DamlClientService {
     private readonly httpClient: HttpService;
     
     constructor(private configService: ConfigService) {
       this.httpClient = new HttpService();
     }
     
     async fetchContracts<T>(templateId: string, query: any): Promise<T[]> {
       const token = this.configService.get('DAML_TOKEN');
       const response = await this.httpClient.post(
         `${this.configService.get('DAML_URL')}/v1/query`,
         { templateId, query },
         { headers: { Authorization: `Bearer ${token}` } }
       ).toPromise();
       
       return response.data.result;
     }
   }
   ```

2. **Token Service**:
   ```typescript
   // src/tokens/services/token.service.ts
   @Injectable()
   export class TokenService {
     constructor(private damlClient: DamlClientService) {}
     
     async getTokenBalances(party: string): Promise<TokenBalanceDto[]> {
       const contracts = await this.damlClient.fetchContracts<any>(
         'Currency.TokenLedger:TokenLedger',
         { holder: party }
       );
       
       return contracts.map(contract => ({
         id: contract.contractId,
         symbol: contract.payload.symbol,
         amount: contract.payload.amount,
         owner: contract.payload.owner,
         holder: contract.payload.holder
       }));
     }
   }
   ```

3. **Token Controller**:
   ```typescript
   // src/tokens/controllers/token.controller.ts
   @Controller('api/tokens')
   export class TokenController {
     constructor(private tokenService: TokenService) {}
     
     @Get('balances')
     @UseGuards(AuthGuard)
     async getBalances(@Request() req): Promise<TokenBalanceDto[]> {
       return this.tokenService.getTokenBalances(req.user.party);
     }
   }
   ```

## Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │ Next.js  │     │  NestJS  │     │  DAML    │
│ Browser  │     │ Frontend │     │ Backend  │     │ Ledger   │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │  Login Request │                │                │
     │───────────────▶│                │                │
     │                │                │                │
     │                │  Auth Request  │                │
     │                │───────────────▶│                │
     │                │                │                │
     │                │                │  Validate      │
     │                │                │───────────────▶│
     │                │                │                │
     │                │                │  Auth Result   │
     │                │                │◀───────────────│
     │                │                │                │
     │                │  JWT Token     │                │
     │                │◀───────────────│                │
     │                │                │                │
     │  Store Token   │                │                │
     │◀───────────────│                │                │
     │                │                │                │
     │  API Request   │                │                │
     │  with JWT      │                │                │
     │───────────────▶│                │                │
     │                │                │                │
     │                │  API Request   │                │
     │                │  with JWT      │                │
     │                │───────────────▶│                │
     │                │                │                │
     │                │                │  DAML Request  │
     │                │                │  with DAML     │
     │                │                │  Token         │
     │                │                │───────────────▶│
```

1. User logs in through the frontend
2. Frontend sends credentials to NestJS backend
3. Backend validates credentials and generates JWT
4. Frontend stores JWT for subsequent requests
5. For DAML operations, backend uses a separate DAML token

## Development Guidelines

### TypeScript Types

Maintain consistent types across the stack:

1. **DAML to Backend**: Define DTOs that match DAML contract structures
2. **Backend to Frontend**: Use consistent types between API responses and frontend models

### API Design

Follow RESTful principles:

- GET /api/tokens - List all tokens
- GET /api/tokens/:id - Get a specific token
- POST /api/tokens/transfer - Transfer tokens
- POST /api/exchange/swap - Execute a token swap

### Error Handling

Implement consistent error handling:

1. **Frontend**: Use React Query's error handling
2. **Backend**: Use NestJS exception filters
3. **DAML**: Properly handle and transform DAML errors

### State Management

1. **Frontend**: Use React Query for server state, Context API for UI state
2. **Backend**: Use NestJS services for state management

## Future Considerations

1. **WebSockets**: For real-time updates from the DAML ledger
2. **GraphQL**: Consider adding GraphQL for more flexible data fetching
3. **Microservices**: Split backend into microservices as the application grows

---

Last updated: July 8, 2025
