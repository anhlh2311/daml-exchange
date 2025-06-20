#!/bin/bash

# Party Manager Script
# Usage: ./party-mgr.sh <script-name> <input (optional)>

set -e

# Configuration
HOST="localhost"
PORT="6865"
DAR_FILE=".daml/dist/exchange-0.0.1.dar"
SCRIPT_MODULE="Scripts.PartyManagement"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to show usage
show_usage() {
    echo "Party Manager - Daml Party Management CLI"
    echo ""
    echo "Usage: $0 <script-name> [input]"
    echo ""
    echo "Available scripts:"
    echo "  init                    - Initialize party registry"
    echo "  add <party-name>        - Add a new party"
    echo "  remove <party-name>     - Remove a party"
    echo "  list                    - List all registered parties"
    echo "  check <party-name>      - Check if party is registered"
    echo "  demo                    - Run full demonstration"
    echo ""
    echo "Examples:"
    echo "  $0 init"
    echo "  $0 add Alice"
    echo "  $0 remove Bob"
    echo "  $0 list"
    echo "  $0 check Alice"
    echo "  $0 demo"
    echo ""
}

# Function to check if DAR file exists
check_dar_file() {
    if [ ! -f "$DAR_FILE" ]; then
        print_error "DAR file not found: $DAR_FILE"
        print_info "Please run 'daml build' first to create the DAR file"
        exit 1
    fi
}

# Function to execute daml script
execute_script() {
    local script_name="$1"
    local input="$2"

    print_info "Executing script: $script_name"

    if [ -n "$input" ]; then
        print_info "With input: $input"
        echo "\"$input\"" | daml script --ledger-host "$HOST" --ledger-port "$PORT" --dar "$DAR_FILE" --script-name "${SCRIPT_MODULE}:${script_name}" --input-file /dev/stdin
    else
        daml script --ledger-host "$HOST" --ledger-port "$PORT" --dar "$DAR_FILE" --script-name "${SCRIPT_MODULE}:${script_name}"
    fi
}

# Main script logic
main() {
    # Check if at least one argument is provided
    if [ $# -eq 0 ]; then
        show_usage
        exit 1
    fi

    # Check if DAR file exists
    check_dar_file

    local command="$1"
    local input="$2"

    case "$command" in
    "init")
        print_info "Initializing party registry..."
        execute_script "cmdInit"
        print_success "Registry initialization completed!"
        ;;

    "add")
        if [ -z "$input" ]; then
            print_error "Party name is required for 'add' command"
            echo "Usage: $0 add <party-name>"
            exit 1
        fi
        print_info "Adding party: $input"
        execute_script "cmdAddParty" "$input"
        print_success "Party '$input' added successfully!"
        ;;

    "remove")
        if [ -z "$input" ]; then
            print_error "Party name is required for 'remove' command"
            echo "Usage: $0 remove <party-name>"
            exit 1
        fi
        print_info "Removing party: $input"
        execute_script "cmdRemoveParty" "$input"
        print_success "Party '$input' removed successfully!"
        ;;

    "list")
        print_info "Listing all registered parties..."
        execute_script "cmdListParties"
        ;;

    "check")
        if [ -z "$input" ]; then
            print_error "Party name is required for 'check' command"
            echo "Usage: $0 check <party-name>"
            exit 1
        fi
        print_info "Checking registration status for: $input"
        execute_script "cmdCheckParty" "$input"
        ;;

    "demo")
        print_info "Running party management demonstration..."
        execute_script "demoPartyManagement"
        print_success "Demo completed!"
        ;;

    "help" | "-h" | "--help")
        show_usage
        ;;

    *)
        print_error "Unknown command: $command"
        echo ""
        show_usage
        exit 1
        ;;
    esac
}

# Trap errors and provide helpful messages
trap 'print_error "Script execution failed. Check the error messages above."' ERR

# Run main function with all arguments
main "$@"
