# DAML Token Exchange System Workflow

## Overview

This document describes the comprehensive workflow of the DAML Token Exchange System. The system is organized into four key workflow areas: Party Registration, Currency Management, Exchange TokenPair Setup, and Exchange Swap Execution. Each workflow builds upon the previous ones to create a complete decentralized token exchange platform.

## System Architecture

### 1. Registry System (Party Management)

#### Core Components

- **PartyRegistry**: Central authority template for managing party registration
- **PartyRegistryUtils**: Utility functions for validation and lookup

#### Workflows

##### Party Registration

1. **Admin** creates a `PartyRegistry` contract
2. **Admin** can register new parties using `RegisterParty` choice
3. **Admin** can unregister parties using `UnregisterParty` choice
4. All registered parties are stored in the registry for validation

##### Party Validation

- All system operations validate party registration through `ensurePartyIsRegistered`
- Only registered parties can participate in token operations and exchange activities

##### Diagram

```mermaid
graph TD
    A[Admin] -->|Creates| B[PartyRegistry]
    A -->|RegisterParty| B
    A -->|UnregisterParty| B
    B -->|Stores| C[Registered Parties List]
    
    %% Validation Process
    D[Any Operation] -->|Requires| E[Party Validation]
    E -->|Checks Against| C
    E -->|Valid| F[Operation Proceeds]
    E -->|Invalid| G[Operation Rejected]
    
    %% Utility Functions
    H[PartyRegistryUtils] -->|ensurePartyIsRegistered| E
    H -->|getPartyRegistryByKey| B
    
    %% Styling
    classDef admin fill:#e1f5fe
    classDef system fill:#f0f0f0
    classDef validation fill:#fff3e0
    
    class A admin
    class B,C,H system
    class D,E,F,G validation
```

### 2. Currency System (Token Management)

#### Core Components

- **TokenMetadata**: Contains token information (name, symbol, decimals, etc.)
- **TokenMaster**: Controls token supply and minting/burning operations
- **TokenLedger**: Tracks individual party token holdings
- **TokenTransferLock**: Implements secure transfer mechanism

#### Workflows

##### Token Creation and Minting

1. **Token Owner** creates a `TokenMaster` contract with metadata
2. **Token Owner** can mint new tokens using `Mint` choice
3. Minting creates or updates the owner's `TokenLedger` with new balance
4. Total supply is tracked in the `TokenMaster` contract

##### Token Transfer Process

1. **Token Holder** initiates transfer by calling `LockTokenForTransfer` on their `TokenLedger`
2. System creates a `TokenTransferLock` contract for the recipient
3. **Recipient** has two options:
   - `Accept`: Tokens move to the recipient's ledger
   - `Reject`: Creates a reverse lock back to the sender
4. **Sender** has one option if the recipient doesn't respond:
   - `Cancel`: Sender cancels the `TokenTransferLock` to reclaim their tokens

##### Token Burning

1. **Token Owner** can burn tokens using `Burn` choice on `TokenMaster`
2. Specified `TokenLedger` contract is consumed
3. Total supply is reduced accordingly
4. Remaining balance (if any) creates new `TokenLedger`

##### Diagram

```mermaid
graph TD
    %% Token Creation and Management
    TO[Token Owner] -->|Creates with Metadata| TM[TokenMaster]
    TO -->|Mint| TL[TokenLedger]
    TO -->|Burn| BS[Reduced Supply]
    
    %% Token Transfer Process
    TH[Token Holder] -->|LockTokenForTransfer| TTL[TokenTransferLock]
    TTL -->|Accept| RTL[Recipient TokenLedger]
    TTL -->|Reject| RTL2[Reverse Lock to Sender]
    TTL -->|Cancel by Sender| TL
    
    %% Supply Control
    TM -->|Controls Total Supply| TL
    TM -->|Tracks Burning| BS
    
    %% Metadata
    TMD[TokenMetadata] -->|Defines Properties| TM
    TMD -->|Contains: name, symbol, decimals| TM
    
    %% Dependencies
    PR[PartyRegistry] -.->|Validates Registration| TL
    PR -.->|Validates Registration| TTL
    
    %% Styling
    classDef tokenOwner fill:#e8f5e8
    classDef user fill:#f3e5f5
    classDef system fill:#f0f0f0
    classDef metadata fill:#e3f2fd
    classDef validation fill:#fff3e0
    
    class TO tokenOwner
    class TH user
    class TM,TL,TTL,RTL,RTL2,BS system
    class TMD metadata
    class PR validation
```

### 3. Exchange TokenPair Setup System

#### Core Components

- **TokenListing**: Manages which tokens are available for trading
- **TokenListingUtils**: Utility functions for listing validation
- **TokenPairSetup**: Template for configuring trading pairs
- **TokenPair**: Defines active trading pairs with exchange rates
- **TokenPairData**: Data structure containing pair information

#### Workflow

##### Token Listing Process

1. **Token Owner** creates `ListingRequest` for their token
2. **Admin** reviews the request and either:
   - `ApproveListing`: Creates an active `TokenListing` contract
   - `RejectListing`: Archives the request
3. **Token Owner** can later request unlisting through `UnlistingRequest`
4. **Admin** can approve unlisting to remove the token from exchange

##### Trading Pair Creation

1. **Admin** creates `TokenPairSetup` specifying two listed tokens
2. System validates both tokens have active `TokenListing` contracts
3. **Admin** calls `CreateTokenPair` with initial buying and selling prices
4. Active `TokenPair` contract is created, ready for trading
5. **Admin** can update exchange rates using `SetRate` or remove the pair entirely

##### Diagram

```mermaid
graph TD
    %% Token Listing Process
    TO[Token Owner] -->|RequestListing| LR[ListingRequest]
    A[Admin] -->|ApproveListing| TL[TokenListing]
    A -->|RejectListing| LRJ[Listing Rejected]
    TO -->|RequestUnlisting| UR[UnlistingRequest]
    A -->|ApproveUnlisting| TU[Token Unlisted]
    
    %% Trading Pair Setup
    A -->|Create| TPS[TokenPairSetup]
    TPS -->|Requires Two Listed Tokens| TL
    A -->|CreateTokenPair| TP[TokenPair]
    A -->|SetRate| TP
    A -->|RemoveTokenPair| TPR[Pair Removed]
    
    %% Validation Flow
    TL -->|Validates Active Listings| TPS
    TPS -->|Creates Trading Infrastructure| TP
    TP -->|Ready for Trading| RFT[Available for Swaps]
    
    %% Dependencies
    PR[PartyRegistry] -.->|Validates Token Owner| LR
    PR -.->|Validates Admin| TPS
    TM[TokenMaster] -.->|Must Exist for Listing| LR
    
    %% Styling
    classDef admin fill:#e1f5fe
    classDef tokenOwner fill:#e8f5e8
    classDef exchange fill:#fff3e0
    classDef system fill:#f0f0f0
    classDef validation fill:#ffeb3b
    classDef ready fill:#c8e6c9
    
    class A admin
    class TO tokenOwner
    class LR,TL,TPS,TP,UR exchange
    class LRJ,TU,TPR,RFT system
    class PR,TM validation
```

### 4. Exchange Swap Execution System

#### Core Components

- **SwapSetup**: Helper template for initiating token swaps
- **SwapRequest**: Manages swap initiation and execution logic
- **LiquidityResponse**: Handles liquidity provider participation
- **TokenTransferLock**: Secures tokens during swap process

#### Workflow

##### Swap Initiation

1. **Swapper** creates `SwapSetup` with desired swap parameters
2. **Swapper** calls `InitiateSwap` which:
   - Validates the TokenPair exists and is active
   - Locks input tokens via `TokenTransferLock`
   - Creates `SwapRequest` with swap details and expected output

##### Liquidity Provider Response

3. **Liquidity Provider** reviews the `SwapRequest`
4. **Liquidity Provider** locks output tokens for the swapper
5. **Liquidity Provider** creates `LiquidityResponse` indicating readiness

##### Swap Execution

6. **Swapper** calls `ConfirmSwap` on the `LiquidityResponse`
7. System validates amounts against current exchange rates
8. Both token locks are accepted simultaneously
9. Tokens are distributed to both parties, completing the swap

##### Cancellation and Rejection Flows

- **Swapper** can `CancelSwap` to retrieve their locked tokens
- **Liquidity Provider** can `RejectSwap` to decline participation
- All cancellations return tokens to their original holders safely

##### Diagram

```mermaid
graph TD
    %% Swap Initiation
    S[Swapper] -->|InitiateSwap| SS[SwapSetup]
    SS -->|Validates TokenPair Exists| TP[TokenPair]
    SS -->|Lock Input Tokens| ITL[Input TokenTransferLock]
    SS -->|Create| SR[SwapRequest]
    
    %% Liquidity Provider Response
    LP[Liquidity Provider] -->|Reviews SwapRequest| SR
    LP -->|Lock Output Tokens| OTL[Output TokenTransferLock]
    LP -->|Create| LRS[LiquidityResponse]
    
    %% Swap Execution
    S -->|ConfirmSwap| LRS
    LRS -->|ExecuteSwap| SE[Swap Execution]
    SE -->|Validates Amounts & Rates| TP
    SE -->|Accept Input Lock| ITL
    SE -->|Accept Output Lock| OTL
    SE -->|Complete| CS[Completed Swap]
    
    %% Final Token Distribution
    CS -->|Tokens to Swapper| STL[Swapper TokenLedger]
    CS -->|Tokens to LP| LPTL[LP TokenLedger]
    
    %% Cancellation and Rejection Flows
    SR -->|CancelSwap| CR[Cancel Input Lock]
    CR -->|Return Tokens| STL2[Swapper Gets Tokens Back]
    LP -->|RejectSwap| RSR[Reject SwapRequest]
    RSR -->|Swapper Can Cancel| CR
    
    %% Rate Validation
    TP -->|Provides Current Rates| SE
    SE -->|Validates Expected Output| TP
    
    %% Dependencies
    PR[PartyRegistry] -.->|Validates All Parties| SR
    CM[Currency Management] -.->|Provides Token Locks| SS
    TL[TokenListing] -.->|Ensures Tokens Are Listed| TP
    
    %% Styling
    classDef user fill:#f3e5f5
    classDef exchange fill:#fff3e0
    classDef system fill:#f0f0f0
    classDef validation fill:#ffeb3b
    classDef success fill:#c8e6c9
    classDef cancel fill:#ffcdd2
    
    class S,LP user
    class SS,SR,LRS,SE exchange
    class ITL,OTL,STL,LPTL,CS,TP system
    class STL2,CR,RSR cancel
    class PR,CM,TL validation
```

## Key Design Patterns

### 1. Permission-based Access Control

- All operations validate party registration through `PartyRegistryUtils`
- Only registered parties can participate in system activities
- Multi-level authorization structure (admin, token owner, liquidity provider, general users)

### 2. Lock-based Secure Transfers

- Tokens are locked rather than immediately transferred
- Recipients must explicitly accept transfers
- Provides safety against unwanted or erroneous transfers

### 3. Two-step Approval Processes

- Token listing requires owner request followed by admin approval
- Token swaps require swapper initiation followed by liquidity provider response
- Ensures explicit consent from all participating parties

### 4. Active Validation Dependencies

- Token pairs continuously validate that underlying tokens remain actively listed
- Swap requests validate current token pair rates and availability
- Prevents operations on delisted, invalid, or stale token pairs

### 5. Atomic Operations

- Swaps execute both sides simultaneously or fail completely
- Token transfers are atomic (lock → accept → ledger update)
- Maintains system consistency and prevents partial states

## Security Considerations

1. **Registry Validation**: All operations check party registration status
2. **Multi-party Signatures**: Critical operations require multiple party authorization
3. **Lock Mechanism**: Prevents accidental or malicious token transfers
4. **Rate Validation**: Swap amounts are validated against current exchange rates
5. **Active Listing Checks**: Ensures only valid tokens participate in trading

## Complete System Usage Flow

1. **System Setup**: Admin creates party registry and registers all participants
2. **Token Creation**: Token owners create `TokenMaster` contracts and mint initial supply
3. **Exchange Listing**: Token owners request listing; admin reviews and approves active tokens
4. **Trading Infrastructure**: Admin creates trading pairs with initial exchange rates
5. **Token Trading**: Users initiate swaps, liquidity providers respond, trades execute atomically
6. **Ongoing Management**: Rate updates, token supply management, and system maintenance
