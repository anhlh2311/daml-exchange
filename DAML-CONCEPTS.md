# DAML Token Exchange: Core Concepts and Workflows

This document provides an overview of the DAML concepts and workflows implemented in our token exchange project. It will be updated as we develop the backend and frontend components.

## Table of Contents
- [DAML Core Concepts](#daml-core-concepts)
- [Project Templates](#project-templates)
- [Key Workflows](#key-workflows)
- [Backend Integration](#backend-integration)
- [Frontend Integration](#frontend-integration)

## DAML Core Concepts

### Parties

In DAML, parties represent the entities that can interact with the ledger:

- **Definition**: Parties are the users or organizations that participate in contracts on the ledger.
- **In our project**: We have several party roles:
  - `owner`: Token issuer who can mint/burn tokens
  - `holder`: Party that holds tokens
  - `swapper`: Party initiating a token swap
  - `liquidityProvider`: Party providing liquidity for swaps
  - `admin`: Exchange administrator

### Templates

Templates are the core data structures in DAML that define the shape and behavior of contracts:

- **Definition**: Templates define the data fields and choices (actions) available on contracts.

### Contract Structure

Each DAML contract has a specific structure:

- **with block**: Defines the data fields of the contract
- **where block**: Contains the contract's behavior including:
  - Signatories
  - Observers
  - Choices
  - Key definitions

### Signatories

- **Definition**: Parties that must authorize the creation of a contract and are automatically informed of all actions on it.
- Signatories have full visibility of the contract and must consent to its creation.

### Controllers

- **Definition**: Parties authorized to exercise specific choices on a contract.
- Controllers can initiate actions that may consume the contract and create new ones.

### Observers

- **Definition**: Parties that can see a contract but cannot directly modify it.
- Observers have read-only access to contracts they observe.

### Choices

- **Definition**: Actions that can be performed on a contract, potentially consuming it and creating new contracts.
- Choices define the business logic and state transitions in DAML applications.

### Keys and Maintainers

- **Definition**: Keys uniquely identify contracts, and maintainers are responsible for their uniqueness.
- Keys allow for efficient contract lookup and prevent duplicates.

## Project Templates

Our exchange implements the following key templates:

### TokenLedger

Represents token balances for a specific holder:

```daml
template TokenLedger
  with
    owner : Party
    holder : Party
    amount : Decimal
    symbol : Text
    metadata : TokenMetadata
    registryKey : Party
  where
    signatory holder
    observer owner
    key (owner, holder): (Party, Party)
    maintainer key._2
```

Key choices:
- `LockTokenForTransfer`: Lock tokens for transfer to another party

### TokenMaster

Controls the total supply of a token:

```daml
template TokenMaster
  with
    owner : Party
    totalSupply : Decimal
    metadata : TokenMetadata
    registryKey : Party
  where
    signatory owner
    key (owner, metadata.symbol) : (Party, Text)
    maintainer key._1
```

Key choices:
- `Mint`: Creates new tokens
- `Burn`: Destroys tokens

### TokenTransferLock

Represents tokens locked for transfer between parties:

```daml
template TokenTransferLock
  with
    owner: Party
    sender: Party
    recipient: Party
    amount: Decimal
    symbol: Text
    metadata: TokenMetadata
    registryKey: Party
  where
    signatory sender
    observer recipient, owner
```

Key choices:
- `Accept`: Recipient accepts the tokens
- `Reject`: Recipient rejects the transfer
- `Cancel`: Sender cancels the transfer

### SwapRequest

Represents a request to swap one token for another:

```daml
template SwapRequest
  with
    swapper: Party
    admin: Party
    liquidityProvider: Party
    tokenPairKey: (Party, (Party, Text), (Party, Text))
    inputAmount: Decimal
    expectedOutputAmount: Decimal
    inputTokenLockCid: ContractId TokenTransferLock
    registryKey: Party
  where
    signatory swapper
    observer admin, liquidityProvider
```

Key choices:
- `ExecuteSwap`: Executes the token swap
- `CancelSwap`: Cancels the swap request
- `RejectSwap`: LP rejects the swap

### TokenPair

Defines a trading pair with exchange rates:

```daml
template TokenPair
  with
    admin: Party
    liquidityProvider: Party
    inputTokenKey: (Party, Text)
    quoteTokenKey: (Party, Text)
    sellingPrice: Decimal
    buyingPrice: Decimal
    registryKey: Party
  where
    signatory admin, liquidityProvider
```

## Key Workflows

### 1. Token Issuance

1. Token owner creates a `TokenSetup` contract
2. Owner initializes the token with `Initialize` choice
3. System creates a `TokenMaster` and initial `TokenLedger` contract
4. Owner can mint additional tokens with the `Mint` choice on `TokenMaster`

### 2. Token Transfer

1. Token holder initiates transfer with `LockTokenForTransfer` choice on their `TokenLedger`
2. System creates a `TokenTransferLock` contract and updates holder's balance
3. Recipient can:
   - `Accept`: Tokens are added to recipient's balance
   - `Reject`: Lock is returned to sender
4. Sender can `Cancel` the transfer if needed

### 3. Token Swap

1. Swapper creates a `SwapSetup` contract
2. Swapper initiates swap with `InitiateSwap` choice
3. System locks swapper's input tokens and creates a `SwapRequest`
4. Liquidity Provider can:
   - Create a `LiquidityResponse` with locked output tokens
   - `RejectSwap` to decline the request
5. Swapper can:
   - `ConfirmSwap` on the `LiquidityResponse` to complete the exchange
   - `CancelSwap` to retrieve their tokens

## Backend Integration

Our NestJS backend connects to the DAML ledger via the JSON API:

### Authentication

- Uses a JWT token with proper DAML ledger API claims:
  - `ledgerId: "sandbox"`
  - `applicationId: "daml-exchange-backend"`
  - `actAs: ["Alice"]`

### Working Endpoints

- `/api/daml/verify-connection`: Tests connection to DAML ledger
- `/api/daml/health`: Checks if DAML ledger is accessible
- `/api/daml/ledger-id`: Gets the DAML ledger ID
- `/api/tokens/test-template/{templateId}`: Tests fetching contracts

### Planned Endpoints

_This section will be updated as we develop the backend_

## Frontend Integration

_This section will be updated as we develop the frontend_

---

## Glossary

- **Contract ID (CID)**: Unique identifier for a contract instance
- **Template**: Blueprint for creating contracts
- **Choice**: Action that can be performed on a contract
- **Signatory**: Party that must authorize contract creation
- **Observer**: Party that can view but not modify a contract
- **Controller**: Party authorized to exercise choices on a contract
- **Maintainer**: Party responsible for ensuring key uniqueness

---

Last updated: July 8, 2025
