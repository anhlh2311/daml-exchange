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

- **SwapRequest**: Manages complete swap lifecycle with direct LP interaction
- **TokenTransferLock**: Secures tokens during swap process
- **TokenSwapUtils**: Enhanced utility functions for swap calculations and validation
- **SwapUtils**: Script utilities for swap creation and management

#### Workflow

##### Swap Initiation

- **Swapper** calls `createSwapWithTokenLocking` utility function which:
  - Validates the TokenPair exists and is active
  - Calculates expected output amount using `calculateExpectedOutputAmount`
  - Locks input tokens via `TokenTransferLock` for the liquidity provider
  - Creates `SwapRequest` with swap details, expected output amount, and slippage tolerance

##### Direct Liquidity Provider Response

- **Liquidity Provider** reviews the `SwapRequest` directly
- **Liquidity Provider** validates current market rates against swap request
- **Liquidity Provider** can choose:
  - `AcceptSwap`: Directly accepts and processes the swap in one step
  - `RejectSwapRequest`: Declines and creates reverse lock for swapper recovery

##### Two-Phase Swap Execution

**Phase 1 - LP Acceptance:**

- **Liquidity Provider** calls `AcceptSwap` choice on `SwapRequest`
- System validates current rates against slippage tolerance
- LP's output tokens are locked for the swapper
- LP immediately receives input tokens from the locked transfer
- SwapRequest is updated with output token lock information

**Phase 2 - Swapper Finalization:**

- **Swapper** calls `FinalizeSwap` choice on the updated `SwapRequest`
- Swapper receives the locked output tokens
- Swap is completed atomically

##### Cancellation and Rejection Flows

- **Swapper** can `CancelSwapRequest` to retrieve their locked tokens
- **Liquidity Provider** can `RejectSwapRequest` to create reverse lock for swapper
- All cancellations return tokens to their original holders safely

##### Enhanced Rate Validation

- Swap amounts validated using `calculateExpectedOutputAmount` with direction awareness
- Slippage tolerance enforced during LP acceptance
- Current TokenPair rates checked at time of LP decision
- Rate direction automatically handled (input token vs quote token)

##### Diagram

```mermaid
graph TD
    %% Swap Initiation by Swapper
    S[Swapper] -->|createSwapWithTokenLocking| SS[SwapUtils]
    SS -->|Validates TokenPair Exists| TP[TokenPair]
    SS -->|Calculate Expected Output| TSU[TokenSwapUtils]
    SS -->|Lock Input Tokens| ITL[Input TokenTransferLock]
    SS -->|Creates| SR[SwapRequest]
    
    %% LP Directly Reviews SwapRequest
    SR -->|LP Reviews Directly| LP[Liquidity Provider]
    LP -->|Checks Current Rates| TP
    LP -->|Makes Decision on| SR
    
    %% LP Decision Point
    LP -->|Decides| LPDEC{Accept or Reject SwapRequest?}
    
    %% LP Acceptance Flow - Direct on SwapRequest
    LPDEC -->|Calls AcceptSwap on| SR
    SR -->|AcceptSwap Choice Validates| SLIP[Slippage Check vs Current Rates]
    SLIP -->|Slippage OK| ACCEPT[LP Locks Output & Gets Input]
    SLIP -->|Slippage Exceeded| REJ[Auto-Reject Swap]
    ACCEPT -->|Updates| SRMOD[SwapRequest with Output Lock Set]
    
    %% LP Rejection Flow - Direct on SwapRequest  
    LPDEC -->|Calls RejectSwapRequest on| SR
    SR -->|RejectSwapRequest Choice Creates| REJLOCK[Reverse Lock for Swapper]
    
    %% Swapper Finalization - Direct on SwapRequest
    SRMOD -->|Swapper Calls FinalizeSwap on| SR
    SR -->|FinalizeSwap Choice| STL[Swapper Gets Output Tokens]
    
    %% Swapper Cancellation - Direct on SwapRequest
    SR -->|Swapper Calls CancelSwapRequest on| SR
    SR -->|CancelSwapRequest Choice| CR[Cancel Input Lock]
    CR -->|Returns Tokens to| STL2[Swapper]
    
    %% Enhanced Utilities
    TSU -->|calculateExpectedOutputAmount| SR
    TSU -->|Direction-aware Calculation| TP
    TSU -->|rangeValidation for Slippage| SR
    
    %% Recovery Paths
    REJLOCK -->|Swapper Can Reclaim via| ITL2[Token Recovery]
    REJ -->|Swapper Can Cancel via| CR
    
    %% Dependencies
    CM[Currency Management] -.->|Provides Token Locks| SS
    TL[TokenListing] -.->|Ensures Tokens Are Listed| TP
    
    %% Styling
    classDef user fill:#f3e5f5
    classDef swapRequest fill:#fff3e0
    classDef system fill:#f0f0f0
    classDef validation fill:#ffeb3b
    classDef success fill:#c8e6c9
    classDef cancel fill:#ffcdd2
    classDef utility fill:#e8f5e8
    classDef decision fill:#e1f5fe
    
    class S,LP user
    class SR swapRequest
    class SS,TSU,TP,SRMOD system
    class ITL,STL,STL2,ACCEPT success
    class CR,REJ,REJLOCK,ITL2 cancel
    class CM,TL validation
    class LPDEC,SLIP decision
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

### 6. Enhanced Swap Workflow

- **Simplified Architecture**: Single `SwapRequest` template handles complete swap lifecycle
- **Direct LP Interaction**: Liquidity providers interact directly with SwapRequest
- **Two-Phase Execution**: LP acceptance followed by swapper finalization
- **Slippage Protection**: Configurable tolerance with real-time validation
- **Enhanced Calculations**: Direction-aware output calculation with `calculateExpectedOutputAmount`
- **Atomic Operations**: Both phases must complete for successful swap execution

## Updated Swap Design Features

### 1. Simplified Architecture

- **Single Template Approach**: Removed `LiquidityResponse` template for direct `SwapRequest` interaction
- **Streamlined Choices**: `AcceptSwap`, `FinalizeSwap`, `CancelSwapRequest`, `RejectSwapRequest`
- **Reduced Complexity**: Fewer contracts to manage while maintaining security

### 2. Enhanced Slippage Protection

- **Configurable Tolerance**: Swappers set acceptable slippage percentage (0-100%)
- **Real-time Validation**: Current rates checked against tolerance at LP acceptance time
- **Automatic Rejection**: Swaps exceeding tolerance are automatically rejected

### 3. Improved Calculation Logic

- **Direction-Aware Calculations**: `calculateExpectedOutputAmount` handles input vs quote token direction
- **Dynamic Rate Application**: Proper buying/selling price selection based on token flow
- **Range Validation**: Ensures slippage tolerance within acceptable bounds

### 4. Two-Phase Execution Model

- **Phase 1 (LP Accept)**: LP validates, locks output tokens, receives input tokens immediately
- **Phase 2 (Swapper Finalize)**: Swapper accepts output tokens to complete swap
- **Atomic Phases**: Each phase is atomic, preventing partial state inconsistencies

### 5. Enhanced Error Recovery

- **Reverse Lock Creation**: LP rejection creates automatic recovery path for swappers
- **Multiple Cancel Options**: Swappers can cancel at different stages
- **Graceful Degradation**: System handles various failure scenarios with token recovery

## Security Considerations

1. **Registry Validation**: All operations check party registration status
2. **Multi-party Signatures**: Critical operations require multiple party authorization
3. **Lock Mechanism**: Prevents accidental or malicious token transfers
4. **Enhanced Rate Validation**: Swap amounts validated with slippage protection
5. **Active Listing Checks**: Ensures only valid tokens participate in trading
6. **Slippage Protection**: Prevents execution of swaps with unfavorable rate changes

## Complete System Usage Flow

1. **System Setup**: Admin creates party registry and registers all participants
2. **Token Creation**: Token owners create `TokenMaster` contracts and mint initial supply
3. **Exchange Listing**: Token owners request listing; admin reviews and approves active tokens
4. **Trading Infrastructure**: Admin creates trading pairs with initial exchange rates
5. **Token Trading**:
   - Users call `createSwapWithTokenLocking` to initiate swaps with slippage tolerance
   - Liquidity providers directly accept or reject swaps through `SwapRequest` choices
   - LP acceptance locks output tokens and immediately transfers input tokens
   - Swappers finalize swaps through `FinalizeSwap` choice
   - Trades execute in two atomic phases with enhanced rate validation
6. **Ongoing Management**: Rate updates, token supply management, and system maintenance
