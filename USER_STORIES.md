# DAML Token Exchange System - User Stories

## Overview

This document contains comprehensive user stories for the DAML Token Exchange System, organized by user roles and system workflows. Each story follows the format: "As a [role], I want to [action] so that [benefit]."

## User Roles

### 1. System Administrator (Admin)

- **Primary Responsibilities**: System setup, party management, token listing approval, trading pair management
- **Permissions**: Full system access, party registration, listing approval/rejection, trading pair creation

### 2. Token Owner

- **Primary Responsibilities**: Token creation, supply management, listing requests
- **Permissions**: Token minting/burning, listing requests, token transfers

### 3. Token Holder/User

- **Primary Responsibilities**: Token transfers, swap initiation
- **Permissions**: Token transfers, swap requests, token acceptance/rejection

### 4. Liquidity Provider

- **Primary Responsibilities**: Providing liquidity for token swaps
- **Permissions**: Swap response, token locking for swaps

---

## 1. Party Registration & Management Stories

### Admin Stories

**US-ADM-001: System Initialization**

- **As a** System Administrator
- **I want to** create a PartyRegistry contract
- **So that** I can manage all system participants and ensure only registered parties can use the exchange

**US-ADM-002: Party Registration**

- **As a** System Administrator
- **I want to** register new parties using the RegisterParty choice
- **So that** authorized users can participate in token operations and exchange activities

**US-ADM-003: Party Unregistration**

- **As a** System Administrator
- **I want to** unregister parties using the UnregisterParty choice
- **So that** I can revoke access for parties that violate system rules or are no longer authorized

**US-ADM-004: Party Validation**

- **As a** System Administrator
- **I want to** ensure all system operations validate party registration
- **So that** only registered parties can participate in token operations and exchange activities

---

## 2. Currency Management Stories

### Token Owner Stories

**US-TO-001: Token Creation**

- **As a** Token Owner
- **I want to** create a TokenMaster contract with metadata (name, symbol, decimals)
- **So that** I can establish a new token with defined properties for the exchange

**US-TO-002: Token Minting**

- **As a** Token Owner
- **I want to** mint new tokens using the Mint choice
- **So that** I can increase the token supply and distribute tokens to users

**US-TO-003: Token Burning**

- **As a** Token Owner
- **I want to** burn tokens using the Burn choice
- **So that** I can reduce token supply and maintain token value

**US-TO-004: Token Listing Request**

- **As a** Token Owner
- **I want to** create a ListingRequest for my token
- **So that** my token can be reviewed and potentially listed on the exchange

**US-TO-005: Token Unlisting Request**

- **As a** Token Owner
- **I want to** request unlisting of my token through UnlistingRequest
- **So that** I can remove my token from trading when necessary

### Token Holder Stories

**US-TH-001: Token Transfer Initiation**

- **As a** Token Holder
- **I want to** initiate a token transfer by calling LockTokenForTransfer on my TokenLedger
- **So that** I can securely send tokens to another party

**US-TH-002: Token Transfer Acceptance**

- **As a** Token Holder
- **I want to** accept incoming token transfers
- **So that** I can receive tokens from other parties

**US-TH-003: Token Transfer Rejection**

- **As a** Token Holder
- **I want to** reject incoming token transfers
- **So that** I can decline unwanted or suspicious token transfers

**US-TH-004: Transfer Cancellation**

- **As a** Token Holder
- **I want to** cancel pending token transfers
- **So that** I can reclaim my tokens if the recipient doesn't respond

**US-TH-005: Balance Tracking**

- **As a** Token Holder
- **I want to** view my TokenLedger balances
- **So that** I can track my token holdings across different tokens

---

## 3. Exchange Listing Management Stories

### Admin Stories

**US-ADM-005: Token Listing Approval**

- **As a** System Administrator
- **I want to** approve token listing requests using ApproveListing
- **So that** qualified tokens can be traded on the exchange

**US-ADM-006: Token Listing Rejection**

- **As a** System Administrator
- **I want to** reject token listing requests using RejectListing
- **So that** I can maintain exchange quality by excluding unsuitable tokens

**US-ADM-007: Token Unlisting Approval**

- **As a** System Administrator
- **I want to** approve token unlisting requests
- **So that** tokens can be removed from trading when requested by owners

**US-ADM-008: Trading Pair Creation**

- **As a** System Administrator
- **I want to** create TokenPairSetup contracts specifying two listed tokens
- **So that** I can establish trading pairs for token swaps

**US-ADM-009: Token Pair Configuration**

- **As a** System Administrator
- **I want to** create TokenPair contracts with initial buying and selling prices
- **So that** users can trade tokens at defined exchange rates

**US-ADM-010: Exchange Rate Updates**

- **As a** System Administrator
- **I want to** update exchange rates using the SetRate choice
- **So that** I can adjust trading prices based on market conditions

**US-ADM-011: Trading Pair Removal**

- **As a** System Administrator
- **I want to** remove trading pairs entirely
- **So that** I can discontinue trading for specific token combinations

---

## 4. Exchange Swap Execution Stories

### Swapper Stories

**US-SW-001: Swap Initiation**

- **As a** Swapper
- **I want to** initiate a token swap using createSwapWithTokenLocking
- **So that** I can exchange my tokens for other tokens at current market rates

**US-SW-002: Swap Confirmation**

- **As a** Swapper
- **I want to** confirm a swap by calling ConfirmSwap on the LiquidityResponse
- **So that** I can complete the token exchange transaction

**US-SW-003: Swap Cancellation**

- **As a** Swapper
- **I want to** cancel a pending swap using CancelSwap
- **So that** I can retrieve my locked tokens if the swap is not proceeding as expected

**US-SW-004: Rate Validation**

- **As a** Swapper
- **I want to** have my swap amounts validated against current TokenPair rates
- **So that** I receive fair pricing based on current market conditions

**US-SW-005: Expected Output Calculation**

- **As a** Swapper
- **I want to** see the expected output amount calculated using calculateSellingAmount
- **So that** I know exactly how many tokens I will receive for my swap

### Liquidity Provider Stories

**US-LP-001: Swap Request Review**

- **As a** Liquidity Provider
- **I want to** review incoming SwapRequest contracts
- **So that** I can evaluate swap opportunities and decide whether to provide liquidity

**US-LP-002: Liquidity Provision**

- **As a** Liquidity Provider
- **I want to** lock output tokens via TokenTransferLock for swappers
- **So that** I can provide liquidity for token swaps

**US-LP-003: Liquidity Response Creation**

- **As a** Liquidity Provider
- **I want to** create LiquidityResponse contracts with output token locks
- **So that** I can participate in swap transactions

**US-LP-004: Swap Rejection**

- **As a** Liquidity Provider
- **I want to** reject swap requests using RejectSwap
- **So that** I can decline participation in unfavorable swap opportunities

---

## 5. System Integration Stories

### Cross-Role Stories

**US-SYS-001: Party Validation Integration**

- **As a** System User (any role)
- **I want to** have all my operations validated against the PartyRegistry
- **So that** only registered parties can participate in system activities

**US-SYS-002: Atomic Swap Execution**

- **As a** System User
- **I want to** have swaps execute both sides simultaneously or fail completely
- **So that** I can ensure system consistency and prevent partial states

**US-SYS-003: Secure Token Transfers**

- **As a** System User
- **I want to** use lock-based token transfers
- **So that** I can prevent accidental or malicious token transfers

**US-SYS-004: Active Listing Validation**

- **As a** System User
- **I want to** have all operations validate against active token listings
- **So that** I can only trade tokens that are currently listed and available

**US-SYS-005: Multi-Party Authorization**

- **As a** System User
- **I want to** have critical operations require multiple party authorization
- **So that** I can ensure security and prevent unauthorized actions
