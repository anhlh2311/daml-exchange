# Party Management CLI Commands

This guide shows how to use the Daml CLI to manage parties in the PartyRegistry using the improved party management system.

## Code Architecture

The party management system is now organized into two modules:

- **`Scripts.PartyUtils`**: Core party and user utilities with functional programming patterns
- **`Scripts.PartyManagement`**: Registry operations and CLI command interface

### Key Improvements

- **Functional Programming**: Curried implementations using `fmap` composition
- **Code Separation**: Utility functions separated from business logic
- **Better Reusability**: Core party functions can be imported independently
- **Enhanced Type Safety**: Improved admin validation and registry lookup

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
# Add Alice
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Alice"')

# Add Bob
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Bob"')
```

**What it does:**

- Uses curried `getPartyByName` implementation for party lookup
- Automatically creates users for new parties
- Validates registry membership before operations

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

#### Add Parties

```bash
./party-mgr.sh add Alice
./party-mgr.sh add Bob
./party-mgr.sh add "Market Maker"
```

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

# 5. Add parties
./party-mgr.sh add "Alice"
./party-mgr.sh add "Bob" 
./party-mgr.sh add "Market Maker"
./party-mgr.sh add "Liquidity Provider"

# 6. List all parties
./party-mgr.sh list

# 7. Check specific parties
./party-mgr.sh check "Alice"
./party-mgr.sh check "Market Maker"

# 8. Remove a party
./party-mgr.sh remove "Bob"

# 9. Verify removal
./party-mgr.sh list

# 10. Run full demo
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

# 5. Add multiple parties
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Alice"')
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Bob"')
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo '"Charlie"')

# 6. List all registered parties
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdListParties

# 7. Check specific party registration
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdCheckParty --input-file <(echo '"Alice"')

# 8. Remove a party
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdRemoveParty --input-file <(echo '"Charlie"')
```

### Using Input Files for Complex Commands

For more complex inputs, create JSON files:

```bash
# Create input file for party name
echo '"NewParty"' > party_input.json

# Use the input file
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file party_input.json

# Clean up
rm party_input.json
```

### Batch Party Operations

```bash
# Create multiple parties in sequence
for party in "Trader1" "Trader2" "Trader3" "Market"; do
  echo "Adding party: $party"
  daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdAddParty --input-file <(echo "\"$party\"")
done

# Verify all parties were added
daml script --dar .daml/dist/exchange-0.0.1.dar --script-name Scripts.PartyManagement:cmdListParties
```

## Technical Implementation Details

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

3. Listing all parties...
     >> Registered parties: ['Admin::1220a4c...','Alice::1220b5d...','Bob::1220c6e...']
```

## Notes

- **Curried Functions**: All party lookup functions now use functional composition
- **Automatic Users**: Party creation automatically includes user setup
- **Registry Validation**: Enhanced admin validation prevents configuration conflicts
- **Code Separation**: Core utilities are now in `Scripts.PartyUtils` for reusability
- **Type Safety**: Improved type checking and validation throughout
- **Functional Style**: Leverages Daml's functional programming capabilities

## Error Handling

The improved implementation includes better error handling:

- **Admin Mismatch**: Clear warnings when registry admin doesn't match expected admin
- **Party Not Found**: Detailed logging when parties aren't found on ledger
- **Registry Conflicts**: Validation to prevent multiple registries with same admin
- **User Creation**: Automatic user creation with proper error propagation 