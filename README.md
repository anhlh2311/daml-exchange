# DAML Token Exchange

A robust implementation of a fungible token exchange system in DAML with minting, transfer (with recipient acceptance), and strong privacy guarantees.

## Project Overview

This project demonstrates a token exchange platform built with DAML smart contracts, a NestJS backend, and a Next.js frontend.

## Architecture

- **DAML Smart Contracts**: Core business logic for token creation, transfer, and exchange
- **NestJS Backend**: REST API for interacting with the DAML ledger via JSON API
- **Next.js Frontend**: User interface for token management with Tailwind CSS styling

## Installation

### Prerequisites

- [DAML SDK](https://docs.daml.com/getting-started/installation.html) (version 2.9.4 or later)
- Node.js 18 or later (for NestJS backend and React frontend)

### Starting the DAML Ledger

1. Build the DAML project:
   ```bash
   cd daml-exchange
   daml build
   ```

2. Start the DAML sandbox with the built DAR file:
   ```bash
   daml start
   ```
   This will start the DAML sandbox on port 7575 (HTTP JSON API) and the ledger API on port 6865.

### Starting the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` with the following content:
   ```
   DAML_LEDGER_HOST=localhost
   DAML_LEDGER_PORT=6865
   DAML_LEDGER_HTTP_PORT=7575
   JWT_SECRET=your-secret-key
   PORT=3001
   NODE_ENV=development
   ```

4. Start the NestJS application:
   ```bash
   npm run start:dev
   ```
   The backend will start on port 3001 with context path `/api`.

5. Access the Swagger API documentation at:
   ```
   http://localhost:3001/api
   ```

### Working API Endpoints

The following endpoints are currently working and can be tested via Swagger:

- `GET /api/daml/verify-connection`: Test DAML ledger connection with hardcoded token
- `GET /api/daml/health`: Check if DAML ledger is accessible
- `GET /api/daml/ledger-id`: Get the DAML ledger ID
- `GET /api/tokens/test-template/{templateId}`: Test fetching contracts of any template ID

### Starting the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on port 3000 and can be accessed at `http://localhost:3000`.

4. For production build:
   ```bash
   npm run build
   npm start
   ```

## Development Notes

### Authentication

The backend currently uses a hardcoded DAML token with the correct ledger ID "sandbox" for authentication with the DAML ledger. This simplifies development and testing. The token includes these claims:

```json
{
  "https://daml.com/ledger-api": {
    "ledgerId": "sandbox",
    "applicationId": "daml-exchange-backend",
    "actAs": ["Alice"]
  }
}
```

### Troubleshooting

#### DAML Ledger Connection Issues

If you encounter connection issues with the DAML ledger:

1. Verify the DAML sandbox is running with `daml start`
2. Check that ports 6865 (Ledger API) and 7575 (HTTP JSON API) are accessible
3. Use the `/api/daml/verify-connection` endpoint to test connectivity
4. Ensure the ledger ID in your token matches the actual ledger ID ("sandbox" for local development)

#### Template ID Format

When querying for DAML contracts, ensure template IDs include the package ID prefix:

```
<package-id>:<module-name>:<entity-name>
```

For example: `daml-exchange-0.0.1:Main:TokenLedger`

## Next Steps

- Complete implementation of all token endpoints
- Add proper user authentication and dynamic token generation
- Connect the frontend to the NestJS backend
- Add automated tests for backend endpoints

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger Documentation**: http://localhost:3001/api
- **DAML Navigator**: http://localhost:7500

This project implements a secure and privacy-preserving currency token system following Daml best practices. The system supports:

- **Token Ownership**: Clear distinction between token owners (who can mint/burn) and holders (who own balances)
- **Minting**: Controlled token creation by authorized owners
- **Transfers**: Secure, two-step token transfers requiring recipient acceptance
- **Burning**: Owner can destroy tokens (fully or partially) and reduce total supply
- **Security**: Built-in validation and authorization controls
- **Privacy**: Only the holder and owner can see balances

## Core Templates

### 1. TokenLedger

Represents a fungible token balance for a holder.

**Key Features:**

- **Parties**: Owner (minter/controller) and Holder (current token owner)
- **Fields**: symbol, amount, metadata
- **Privacy**: Only the holder (signatory) and owner (observer) can see the contract
- **Validation**: Non-negative amounts, sufficient balance checks

**Choices:**

- `LockTokenForTransfer`: Initiate a transfer by locking tokens for a recipient, creating a TokenTransferLock contract

### 2. TokenMaster

Controls minting and burning of a token type, and tracks total supply.

**Key Features:**

- **Owner Control**: Only the owner can mint or burn tokens
- **Supply Tracking**: Maintains total supply
- **Observers**: Owner can specify additional observers for the master contract (not for balances)

**Choices:**

- `Mint`: Create new tokens for the owner
- `Burn`: Destroy tokens and reduce total supply. Can burn a partial amount, returning a new TokenLedger contract for the remaining balance if any. Takes an `Optional Decimal` for the amount to burn: if `None`, burns the entire balance; if `Some amount`, burns only that amount.

### 3. TokenTransferLock

Represents a pending transfer that must be accepted or rejected by the recipient.

**Key Features:**

- **Two-Step Transfer**: Sender locks tokens, recipient must accept or reject
- **Cancellation**: Sender can cancel a pending transfer and reclaim tokens
- **Privacy**: Only sender, recipient, and owner can see the lock

**Choices:**

- `Accept`: Recipient accepts and receives the tokens
- `Reject`: Recipient rejects, sender can reclaim
- `Cancel`: Sender cancels and reclaims tokens

### 4. TokenSetup

Initializes a new token type and creates the first TokenMaster and TokenLedger contracts.

## Usage Examples

### Basic Setup and Minting

```daml
-- 1. Create token setup
setupCid <- submit owner do
  createCmd TokenSetup with
    owner = owner
    initialSupply = 0.0
    metadata = myTokenMetadata
    observers = [alice, bob]

-- 2. Initialize the system
(masterCid, ownerLedgerCid) <- submit owner do
  exerciseCmd setupCid Initialize

-- 3. Mint tokens to the owner
(masterCid2, ownerLedgerCid2) <- submit owner do
  exerciseCmd masterCid Mint with amount = 100.0
```

### Token Transfers (Lock/Accept Pattern)

```daml
-- Owner locks 30 tokens for Alice
(lockCid, ownerLedgerCid3Opt) <- submit owner do
  exerciseCmd ownerLedgerCid2 LockTokenForTransfer with
    recipient = alice
    transferAmount = 30.0
let ownerLedgerCid3 = fromSome ownerLedgerCid3Opt

-- Alice accepts the transfer
aliceLedgerCid <- submit alice do
  exerciseCmd lockCid Accept

-- Alice can now lock tokens for Bob, or reject/cancel as needed
```

### Rejecting or Cancelling a Transfer

```daml
-- Alice rejects a transfer
reverseLockCid <- submit alice do
  exerciseCmd lockCid Reject

-- Sender (owner) accepts the reverse lock to reclaim tokens
ownerLedgerCid4 <- submit owner do
  exerciseCmd reverseLockCid Accept

-- Sender can also cancel a pending transfer before recipient acts
ownerLedgerCid5 <- submit owner do
  exerciseCmd lockCid Cancel
```

### Burning Tokens (Partial or Full)

```daml
-- Owner burns 10 tokens from their balance (partial burn)
(masterCid3, ownerLedgerCid3Opt) <- submit owner do
  exerciseCmd masterCid2 Burn with
    tokenCid = ownerLedgerCid3
    amountToBurn = Some 10.0
-- ownerLedgerCid3Opt is Some cid if there is a remaining balance, None if fully burned

-- Owner burns all remaining tokens (full burn)
(masterCid4, ownerLedgerCid4Opt) <- submit owner do
  exerciseCmd masterCid3 Burn with
    tokenCid = fromSome ownerLedgerCid3Opt
    amountToBurn = None
-- ownerLedgerCid4Opt will be None if all tokens are burned
```

## Best Practices Implemented

### 1. **Security and Authorization**

- Only the holder can initiate transfers from their balance
- Only the owner can mint or burn tokens
- All amounts and operations are validated

### 2. **Privacy**

- Only the holder and owner can see a TokenLedger contract
- Only sender, recipient, and owner can see a TokenTransferLock
- No general observers for balances

### 3. **Auditability and Transparency**

- Total supply tracked at the master level
- Clear ownership and holder distinctions

### 4. **Error Handling**

- Comprehensive input validation
- Clear error messages with `assertMsg`
- Prevent double-spending and negative balances

### 5. **Extensibility**

- Metadata supports extensible token information
- Symbol-based token identification

## Testing

The project includes comprehensive tests in `TokenLedgerTest.daml`:

```bash
# Run all tests
daml test --files ./daml/TokenLedgerTest.daml
```

Test scenarios cover:

- Complete token lifecycle (setup → mint → lock → accept/reject/cancel → burn)
- Error handling (insufficient balance, negative/zero amounts, unauthorized actions)
- Privacy and contract visibility
- Double-use and contract archival edge cases

## Key Design Decisions

### 1. **Single Balance per Holder**

- Each party can only have a single TokenLedger contract per token type at a time
- No need for merge or split operations

### 2. **Two-Step Transfers**

- Transfers require recipient acceptance (lock/accept pattern)
- Sender can cancel, recipient can reject

### 3. **Immutable Total Supply Tracking**

- TokenMaster contract maintains authoritative supply record
- All mint/burn operations update the master contract

## Building and Running

```bash
# Build the project
daml build

# Start Daml sandbox
daml sandbox

# Upload DAR to ledger
daml ledger upload-dar .daml/dist/exchange-0.0.1.dar

# Run tests
daml test --files ./daml/TokenLedgerTest.daml
```

## Frontend Features

The frontend is built with Next.js and Tailwind CSS, providing a modern and responsive user interface for the DAML token exchange platform.

### Key Features

- **Party Selection**: Dropdown to select different parties (owner, holder, swapper, liquidityProvider, admin)
- **Dashboard**: Overview of token balances, recent activities, and key statistics
- **Token Management**: Interface for viewing, transferring, minting, and burning tokens
- **Exchange Interface**: Token swap functionality with rate display and transaction history
- **Responsive Design**: Mobile-friendly interface that works across devices

### Technical Implementation

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS for utility-first styling
- **Components**: Modular component architecture with layout, common, and feature-specific components
- **State Management**: React hooks for local state management
- **UI Libraries**: Headless UI for accessible components

### Directory Structure

```
frontend/
├── app/                  # Next.js app directory with pages
│   ├── dashboard/        # Dashboard page
│   ├── tokens/           # Token management page
│   ├── exchange/         # Exchange interface page
│   └── layout.tsx        # Root layout component
├── components/           # Reusable React components
│   ├── common/           # Common UI components
│   ├── dashboard/        # Dashboard-specific components
│   └── layout/           # Layout components (header, footer)
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Party Management

The project includes a comprehensive party management system with improved functional programming patterns and modular architecture.

### Code Architecture

The party management system is organized into two modules:

- **`Scripts.PartyUtils`**: Core party and user utilities with functional programming patterns
- **`Scripts.PartyManagement`**: Registry operations and CLI command interface

**Key Improvements:**

- **Functional Programming**: Curried implementations using `fmap` composition for cleaner code
- **Code Separation**: Utility functions separated from business logic for better reusability
- **Enhanced Type Safety**: Improved admin validation and registry lookup with conflict prevention
- **Automatic User Creation**: All party creation includes automatic user setup

### Party Registry System

The `PartyRegistry` template manages registered parties who can participate in the token system. All token operations require parties to be registered first.

**Key Features:**

- **Admin Control**: Only admin can register/unregister parties with enhanced validation
- **Registration Validation**: All token operations check party registration status
- **Dynamic Management**: Parties can be added/removed at runtime
- **Visibility**: All registered parties can see the registry
- **Conflict Prevention**: Enhanced admin validation prevents registry cross-contamination

### CLI Party Management Tool

Use the `party-mgr.sh` script for easy party management. For detailed CLI documentation, see [`PARTY_MANAGEMENT_CLI.md`](PARTY_MANAGEMENT_CLI.md).

```bash
# Make the script executable (first time only)
chmod +x party-mgr.sh

# Initialize the party registry
./party-mgr.sh init

# Add new parties
./party-mgr.sh add Alice
./party-mgr.sh add Bob
./party-mgr.sh add TokenOwner

# List all registered parties
./party-mgr.sh list

# Check if a party is registered
./party-mgr.sh check Alice

# Remove a party from registry
./party-mgr.sh remove Bob

# Run full demonstration
./party-mgr.sh demo

# Show help
./party-mgr.sh help
```

### Script Configuration

The script connects to a local Daml ledger by default:

- **Host**: `localhost`
- **Port**: `6865`
- **DAR File**: `.daml/dist/exchange-0.0.1.dar`

To modify these settings, edit the configuration section in `party-mgr.sh`:

```bash
# Configuration
HOST="localhost"
PORT="6865"
DAR_FILE=".daml/dist/exchange-0.0.1.dar"
```

### Manual Party Management with CLI Scripts

You can also manage parties directly using Daml Script commands (after uploading the DAR):

```bash
# Upload DAR to ledger (if not already done)
daml ledger upload-dar .daml/dist/exchange-0.0.1.dar

# Initialize registry
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdInit

# Add parties
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Alice"')
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Bob"')

# List all registered parties
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdListParties

# Check registration status
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdCheckParty --input-file <(echo '"Alice"')

# Remove a party
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdRemoveParty --input-file <(echo '"Bob"')
```

#### Technical Implementation Highlights

**Curried Function Examples:**

```haskell
-- Old imperative style:
getPartyByName name = do
  partyDetails <- getPartyDetailsByName name
  case partyDetails of
    Some partyDetails -> return (Some partyDetails.party)
    None -> return None

-- New curried style (cleaner and more functional):
getPartyByName name = fmap (fmap (.party)) (getPartyDetailsByName name)

-- Admin party lookup using composition:
getAdminParty = fmap (fmap (.party)) (getPartyDetailsByName "Admin")
```

**Enhanced Registry Validation:**

```haskell
findExistingRegistryInternal expectedAdmin = do
  optRegistries <- queryContractKey @PartyRegistry expectedAdmin expectedAdmin
  case optRegistries of
    Some (registryCid, registry) ->
      if registry.admin == expectedAdmin
      then return (Some (registryCid, registry))
      else logMismatchAndReturnNone
```

### Integration with Token System

Before using the token system, ensure parties are registered:

1. **Build and Upload**: `daml build && daml ledger upload-dar .daml/dist/exchange-0.0.1.dar`
2. **Initialize Registry**: `./party-mgr.sh init`
3. **Register Token Owner**: `./party-mgr.sh add TokenOwner`
4. **Register Token Holders**: `./party-mgr.sh add Alice`, `./party-mgr.sh add Bob`
5. **Verify Registration**: `./party-mgr.sh list`

Then proceed with token operations using registered parties only.

## Integration Notes

For frontend integration:

- Use the generated TypeScript/JavaScript bindings
- Implement proper party authentication
- Handle contract IDs for token references

For enterprise deployment:

- Configure appropriate ledger participants
- Set up proper key management
- Implement monitoring for supply and transfers
- Consider privacy implications with observer lists (for TokenMaster only)

## License

This template is provided as-is for educational and development purposes.
