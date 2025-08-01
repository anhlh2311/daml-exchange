# Party Management CLI Commands

This guide shows how to use the Daml CLI to manage parties in the PartyRegistry using the improved party management system with automatic contract observer updates.

## Code Architecture

The party management system is now organized into two modules:

- **`Scripts.PartyUtils`**: Core party and user utilities with functional programming patterns
- **`Scripts.PartyManagement`**: Registry operations, CLI command interface, and contract observer management

### Key Improvements

- **Functional Programming**: Curried implementations using `fmap` composition
- **Code Separation**: Utility functions separated from business logic
- **Better Reusability**: Core party functions can be imported independently
- **Enhanced Type Safety**: Improved admin validation and registry lookup
- **Automatic Contract Updates**: When parties are registered, existing TokenPair and TokenListing contracts are automatically updated to include new observers
- **Batch Operations**: Support for registering multiple parties efficiently

### Contract Observer Updates

When new parties are registered, the system automatically:

1. **Queries existing TokenPair contracts** administered by the admin
2. **Queries existing TokenListing contracts** administered by the admin  
3. **Updates observer lists** by exercising `UpdateTokenPairObservers` and `UpdateTokenListingObservers` choices
4. **Maintains contract integrity** while expanding visibility to new parties

This ensures that newly registered parties can immediately observe relevant exchange contracts without manual intervention.

## Prerequisites

1. Build the project: `daml build`
2. Start Daml Sandbox: `daml sandbox`
3. Upload DAR to ledger: `daml ledger upload-dar .daml/dist/exchange-0.0.1.dar`

## CLI Commands

### 1. Initialize Registry

```bash
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdInit
```

**What it does:**

- Creates or finds admin party using functional composition
- Validates registry ownership with improved admin matching
- Automatically creates users for parties

### 2. Add a Party

```bash
# Add Alice (automatically updates contract observers)
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Alice"')

# Add Bob (automatically updates contract observers)
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Bob"')
```

**What it does:**

- Uses curried `getPartyByName` implementation for party lookup
- Automatically creates users for new parties
- Validates registry membership before operations
- **Updates all existing TokenPair and TokenListing contracts** to include the new party as an observer
- Maintains contract observer lists for proper visibility

### 2b. Add Multiple Parties (Batch Operation)

```bash
# Create input file for multiple parties
echo '["Alice", "Bob", "Charlie", "MarketMaker"]' > parties_input.json

# Add multiple parties efficiently
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParties --input-file parties_input.json

# Clean up
rm parties_input.json
```

**What it does:**

- Registers all parties in the batch
- **Updates contracts only once** at the end (more efficient than individual updates)
- Maintains consistency across all contract observer lists

### 3. List All Parties

```bash
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdListParties
```

### 4. Check if Party is Registered

```bash
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdCheckParty --input-file <(echo '"Alice"')
```

### 5. Remove a Party

```bash
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdRemoveParty --input-file <(echo '"Alice"')
```

**What it does:**

- Uses improved `getPartyByName` with curried implementation
- Validates admin permissions before removal

### 6. Run Full Demo

```bash
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:demoPartyManagement
```

## Bash Script Usage (`party-mgr.sh`)

The project includes a convenient bash script that simplifies party management operations. The script provides a user-friendly interface with colored output and error handling.

### Prerequisites for Script Usage

1. Build the project: `daml build`
2. Start Daml Sandbox: `daml sandbox --ledger-host localhost --ledger-port 6865`
3. Upload DAR to ledger: `daml ledger upload-dar .daml/dist/exchange-0.0.1.dar --host localhost --port 6865`
4. Make the script executable: `chmod +x party-mgr.sh`

### Available Commands

#### Initialize Registry

```bash
./party-mgr.sh init
```

#### Add Single Party

```bash
./party-mgr.sh add Alice
./party-mgr.sh add Bob
./party-mgr.sh add "Market Maker"
```

**Note**: Each individual party addition automatically updates existing contract observers.

#### Add Multiple Parties (Batch)

```bash
./party-mgr.sh add-batch "Alice,Bob,Charlie,MarketMaker"
```

**Benefits**: 

- More efficient than individual additions
- Updates contracts only once at the end
- Reduces transaction overhead for bulk operations

#### List All Parties

```bash
./party-mgr.sh list
```

#### Check Party Registration

```bash
./party-mgr.sh check Alice
./party-mgr.sh check Bob
```

#### Remove Parties

```bash
./party-mgr.sh remove Alice
./party-mgr.sh remove "Market Maker"
```

#### Run Full Demo

```bash
./party-mgr.sh demo
```

#### Show Help

```bash
./party-mgr.sh help
# or
./party-mgr.sh -h
# or
./party-mgr.sh --help
```

### Script Features

- **Colored Output**: Uses colored terminal output for better readability
  - 🔵 Blue for informational messages
  - ✅ Green for success messages
  - ⚠️ Yellow for warnings
  - ❌ Red for errors

- **Error Handling**: Comprehensive error checking and user-friendly error messages

- **DAR File Validation**: Automatically checks if the DAR file exists before execution

- **Flexible Input**: Supports party names with spaces when quoted

- **Connection Configuration**: Connects to sandbox at `localhost:6865` by default

- **Batch Operations**: Support for efficient multi-party registration

### Example Workflow with Script

```bash
# 1. Build and start sandbox
daml build
daml sandbox --ledger-host localhost --ledger-port 6865 &

# 2. Upload DAR to ledger
daml ledger upload-dar .daml/dist/exchange-0.0.1.dar --host localhost --port 6865

# 3. Make script executable
chmod +x party-mgr.sh

# 4. Initialize registry
./party-mgr.sh init

# 5. Add parties individually (each updates contracts)
./party-mgr.sh add "Alice"
./party-mgr.sh add "Bob" 

# 6. Add multiple parties efficiently (updates contracts once)
./party-mgr.sh add-batch "MarketMaker,LiquidityProvider,Trader1,Trader2"

# 7. List all parties
./party-mgr.sh list

# 8. Check specific parties
./party-mgr.sh check "Alice"
./party-mgr.sh check "MarketMaker"

# 9. Remove a party
./party-mgr.sh remove "Bob"

# 10. Verify removal
./party-mgr.sh list

# 11. Run full demo
./party-mgr.sh demo
```

### Script Configuration

The script uses the following default configuration (editable in the script):

```bash
HOST="localhost"
PORT="6865"
DAR_FILE=".daml/dist/exchange-0.0.1.dar"
SCRIPT_MODULE="Scripts.PartyManagement"
```

### Error Scenarios

The script handles common error scenarios:

- **Missing DAR file**: Prompts to run `daml build`
- **Missing party name**: Shows proper usage for commands requiring input
- **Invalid commands**: Displays help information
- **Connection issues**: Provides clear error messages for sandbox connection problems

## CLI Script Usage Examples

### Complete Party Management Workflow

Here's a complete example of setting up and managing parties using CLI commands:

```bash
# 1. Build the project
daml build

# 2. Start sandbox in background
daml sandbox &

# 3. Upload DAR to ledger
daml ledger upload-dar .daml/dist/exchange-0.0.1.dar

# 4. Initialize the registry
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdInit

# 5. Add multiple parties individually (each updates contracts)
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Alice"')
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Bob"')
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Charlie"')

# 6. Or add multiple parties efficiently (updates contracts once)
echo '["Trader1", "Trader2", "MarketMaker"]' > batch_parties.json
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParties --input-file batch_parties.json
rm batch_parties.json

# 7. List all registered parties
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdListParties

# 8. Check specific party registration
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdCheckParty --input-file <(echo '"Alice"')

# 9. Remove a party
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdRemoveParty --input-file <(echo '"Charlie"')
```

### Using Input Files for Complex Commands

For more complex inputs, create JSON files:

```bash
# Create input file for party name
echo '"NewParty"' > party_input.json

# Use the input file
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file party_input.json

# Create input file for multiple parties
echo '["Party1", "Party2", "Party3"]' > parties_input.json

# Use the batch input file
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParties --input-file parties_input.json

# Clean up
rm party_input.json parties_input.json
```

### Batch Party Operations

```bash
# Create multiple parties in sequence (less efficient - updates contracts each time)
for party in "Trader1" "Trader2" "Trader3" "Market"; do
  echo "Adding party: $party"
  daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo "\"$party\"")
done

# Create multiple parties efficiently (recommended - updates contracts once)
echo '["Trader1", "Trader2", "Trader3", "Market"]' > batch.json
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParties --input-file batch.json
rm batch.json

# Verify all parties were added
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdListParties
```

## Technical Implementation Details

### Contract Observer Update Process

When parties are registered, the system performs the following steps:

1. **Party Registration**: Adds party to PartyRegistry as before
2. **Contract Query**: Queries all existing TokenPair and TokenListing contracts
3. **Observer Update**: For each contract administered by the admin:
   - Exercises `UpdateTokenPairObservers` choice on TokenPair contracts
   - Exercises `UpdateTokenListingObservers` choice on TokenListing contracts
4. **Registry Update**: Updates the registry with current observer information

```haskell
-- Enhanced party registration with contract updates
registerPartyAndUpdateContracts : Party -> Text -> Script Party
registerPartyAndUpdateContracts admin name = do
  newParty <- allocateAndRegisterParty admin name
  updateAllContractsWithNewObservers admin  -- New functionality
  return newParty

-- Batch registration (more efficient)
registerPartiesAndUpdateContracts : Party -> [Text] -> Script [Party] 
registerPartiesAndUpdateContracts admin partyNames = do
  newParties <- allocateAndRegisterParties admin partyNames
  updateAllContractsWithNewObservers admin  -- Update once at the end
  return newParties
```

### Curried Function Implementations

The new implementation uses functional programming patterns:

```haskell
-- Old imperative style:
getPartyByName name = do
  partyDetails <- getPartyDetailsByName name
  case partyDetails of
    Some partyDetails -> return (Some partyDetails.party)
    None -> return None

-- New curried style:
getPartyByName name = fmap (fmap (.party)) (getPartyDetailsByName name)
```

**Type Transformations:**

- `getPartyDetailsByName name` : `Script (Optional PartyDetails)`
- `fmap (.party)` : `Optional PartyDetails -> Optional Party`
- `fmap (fmap (.party))` : `Script (Optional PartyDetails) -> Script (Optional Party)`

### Registry Validation

Enhanced admin validation prevents cross-contamination:

```haskell
findExistingRegistryInternal expectedAdmin = do
  optRegistries <- queryContractKey @PartyRegistry expectedAdmin expectedAdmin
  case optRegistries of
    Some (registryCid, registry) -> do
      if registry.admin == expectedAdmin
      then return (Some (registryCid, registry))
      else -- Log mismatch and return None
```

### Automatic User Creation

All party creation now includes automatic user setup:

```haskell
getOrCreateParty name = do
  party <- -- party lookup/creation logic
  user <- createUserFromParty party  -- Automatic user creation
  return party
```

## Example Output

```bash
🚀 Starting Party Management Demo...

1. Initializing registry...
 - Found existing admin party: 'Admin::1220a4c...'
     Registry already exists with ID: #0:0
     Registry admin: 'Admin::1220a4c...'
       >> Registry initialization skipped - using existing registry!

2. Adding parties...
     >> Found existing party 'Alice': 'Alice::1220b5d...'
 - Party 'Alice' is already registered
       >> Party registration skipped - already exists!

3. Updating contracts with new observers...
Updating all contracts with new observers for admin: 'Admin::1220a4c...'
Updating TokenPair: #1:0
Updated TokenPair: #1:1
Updating TokenListing: #2:0  
Updated TokenListing: #2:1
All contracts updated with new observers

4. Listing all parties...
     >> Registered parties: ['Admin::1220a4c...','Alice::1220b5d...','Bob::1220c6e...']
```

## Performance Considerations

### Individual vs Batch Operations

- **Individual Party Addition**: Each call to `cmdAddParty` updates all contracts
- **Batch Party Addition**: `cmdAddParties` registers all parties first, then updates contracts once
- **Recommendation**: Use batch operations when adding multiple parties to reduce transaction overhead

### Contract Update Efficiency

The system only updates contracts where the admin matches the party performing the update, ensuring:
- No unnecessary contract modifications
- Proper authorization and access control
- Efficient use of ledger resources

## Notes

- **Curried Functions**: All party lookup functions now use functional composition
- **Automatic Users**: Party creation automatically includes user setup
- **Registry Validation**: Enhanced admin validation prevents configuration conflicts
- **Code Separation**: Core utilities are now in `Scripts.PartyUtils` for reusability
- **Type Safety**: Improved type checking and validation throughout
- **Functional Style**: Leverages Daml's functional programming capabilities
- **Contract Observer Management**: Automatic updates ensure proper visibility for new parties
- **Batch Efficiency**: Support for bulk operations reduces transaction overhead

## Error Handling

The improved implementation includes better error handling:

- **Admin Mismatch**: Clear warnings when registry admin doesn't match expected admin
- **Party Not Found**: Detailed logging when parties aren't found on ledger
- **Registry Conflicts**: Validation to prevent multiple registries with same admin
- **User Creation**: Automatic user creation with proper error propagation
- **Contract Update Failures**: Graceful handling of contract update issues with detailed logging

## Integration with Exchange System

The automatic contract observer updates ensure seamless integration with the token exchange system:

1. **Immediate Visibility**: New parties can immediately see relevant TokenPair and TokenListing contracts
2. **No Manual Updates**: No need to manually update contract observers after party registration
3. **Consistent State**: All contracts maintain consistent observer lists
4. **Exchange Ready**: Parties are immediately ready to participate in token exchanges 