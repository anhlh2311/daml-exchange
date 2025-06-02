# TokenLedger - Daml Fungible Token Template

A robust implementation of a fungible token system in Daml with minting, transfer (with recipient acceptance), and strong privacy guarantees.

## Overview

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
- `Burn`: Destroy tokens and reduce total supply. Can burn a partial amount, returning a new TokenLedger contract for the remaining balance if any.

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
    amount = 10.0
-- ownerLedgerCid3Opt is Some cid if there is a remaining balance, None if fully burned

-- Owner burns all remaining tokens (full burn)
(masterCid4, ownerLedgerCid4Opt) <- submit owner do
  exerciseCmd masterCid3 Burn with
    tokenCid = fromSome ownerLedgerCid3Opt
    amount = <remaining amount>
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
daml start

# Run tests
daml test --files ./daml/TokenLedgerTest.daml
```

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