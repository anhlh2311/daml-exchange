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

**US-SW-001: Swap Initiation with Slippage Protection**

- **As a** Swapper
- **I want to** initiate a token swap using createSwapWithTokenLocking with configurable slippage tolerance
- **So that** I can exchange my tokens for other tokens while protecting against unfavorable rate changes

**US-SW-002: Enhanced Output Calculation**

- **As a** Swapper
- **I want to** see the expected output amount calculated using calculateExpectedOutputAmount with direction awareness
- **So that** I know exactly how many tokens I will receive based on current rates and token flow direction

**US-SW-003: Swap Finalization**

- **As a** Swapper
- **I want to** finalize a swap by calling FinalizeSwap on the SwapRequest after LP acceptance
- **So that** I can complete the token exchange transaction in the two-phase execution model

**US-SW-004: Swap Cancellation**

- **As a** Swapper
- **I want to** cancel a pending swap using CancelSwapRequest
- **So that** I can retrieve my locked tokens if the swap is not proceeding as expected

**US-SW-005: Rate Validation with Slippage**

- **As a** Swapper
- **I want to** have my swap amounts validated against current TokenPair rates with slippage tolerance
- **So that** I receive fair pricing based on current market conditions within my acceptable range

**US-SW-006: Slippage Tolerance Configuration**

- **As a** Swapper
- **I want to** set my slippage tolerance percentage (0-100%) when initiating swaps
- **So that** I can control how much rate deviation I'm willing to accept

**US-SW-007: Token Recovery from Rejection**

- **As a** Swapper
- **I want to** recover my tokens when a LP rejects my swap request
- **So that** I can reclaim my locked tokens through the reverse lock mechanism

### Liquidity Provider Stories

**US-LP-001: Direct Swap Request Review**

- **As a** Liquidity Provider
- **I want to** review incoming SwapRequest contracts directly
- **So that** I can evaluate swap opportunities and decide whether to provide liquidity without intermediate templates

**US-LP-002: Swap Acceptance with Rate Validation**

- **As a** Liquidity Provider
- **I want to** accept swaps using AcceptSwap on SwapRequest with real-time rate validation
- **So that** I can provide liquidity while ensuring current rates are within the swapper's slippage tolerance

**US-LP-003: Immediate Token Exchange**

- **As a** Liquidity Provider
- **I want to** receive input tokens immediately when accepting a swap
- **So that** I can complete my side of the transaction in the first phase of the two-phase execution

**US-LP-004: Output Token Locking**

- **As a** Liquidity Provider
- **I want to** lock output tokens for the swapper when accepting a swap
- **So that** I can ensure the swapper can complete the transaction in the second phase

**US-LP-005: Swap Rejection with Recovery**

- **As a** Liquidity Provider
- **I want to** reject swap requests using RejectSwapRequest
- **So that** I can decline participation in unfavorable swap opportunities while providing token recovery for the swapper

**US-LP-006: Slippage-based Automatic Rejection**

- **As a** Liquidity Provider
- **I want to** have swaps automatically rejected when current rates exceed the swapper's slippage tolerance
- **So that** I can avoid executing swaps that would be unfavorable to the swapper

**US-LP-007: Balance Validation**

- **As a** Liquidity Provider
- **I want to** have my token balance validated before accepting swaps
- **So that** I can ensure I have sufficient tokens to complete the swap transaction

---

## 5. System Integration Stories

### Cross-Role Stories

**US-SYS-001: Party Validation Integration**

- **As a** System User (any role)
- **I want to** have all my operations validated against the PartyRegistry
- **So that** only registered parties can participate in system activities

**US-SYS-002: Two-Phase Atomic Swap Execution**

- **As a** System User
- **I want to** have swaps execute in two atomic phases (LP acceptance and swapper finalization)
- **So that** I can ensure system consistency and prevent partial states while maintaining security

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

**US-SYS-006: Slippage Protection System**

- **As a** System User
- **I want to** have automatic slippage protection that validates current rates against my tolerance
- **So that** I can prevent execution of swaps with unfavorable rate changes

**US-SYS-007: Enhanced Rate Calculation**

- **As a** System User
- **I want to** have direction-aware rate calculations that handle input vs quote token scenarios
- **So that** I can receive accurate pricing regardless of which token I'm trading

**US-SYS-008: Simplified Swap Architecture**

- **As a** System User
- **I want to** interact with a single SwapRequest template for all swap operations
- **So that** I can have a streamlined experience without managing multiple contract types

**US-SYS-009: Real-time Rate Validation**

- **As a** System User
- **I want to** have current market rates validated at the time of swap acceptance
- **So that** I can ensure fair pricing based on the most recent market conditions

**US-SYS-010: Graceful Error Recovery**

- **As a** System User
- **I want to** have multiple recovery paths when swaps fail or are rejected
- **So that** I can always reclaim my tokens and have clear options for resolution

---

## 6. Updated Swap Design Features

### Enhanced Swap Architecture Stories

**US-UPD-001: Simplified Contract Management**

- **As a** System User
- **I want to** work with a single SwapRequest template instead of multiple contract types
- **So that** I can have a simpler, more intuitive swap experience

**US-UPD-002: Direct LP Interaction**

- **As a** Liquidity Provider
- **I want to** interact directly with SwapRequest contracts without intermediate templates
- **So that** I can respond to swap requests more efficiently

**US-UPD-003: Configurable Slippage Tolerance**

- **As a** Swapper
- **I want to** set my slippage tolerance percentage (0-100%) when creating swap requests
- **So that** I can control the acceptable range of rate deviation for my trades

**US-UPD-004: Real-time Slippage Validation**

- **As a** Liquidity Provider
- **I want to** have swap requests automatically validated against current rates and slippage tolerance
- **So that** I can ensure swaps are executed fairly without manual rate checking

**US-UPD-005: Direction-Aware Output Calculation**

- **As a** System User
- **I want to** have output amounts calculated based on token direction (input vs quote token)
- **So that** I can receive accurate pricing regardless of which tokens I'm trading

**US-UPD-006: Two-Phase Execution Safety**

- **As a** System User
- **I want to** have swaps execute in two distinct phases (LP acceptance and swapper finalization)
- **So that** I can ensure both parties complete their obligations before the swap is finalized

**US-UPD-007: Automatic Slippage Rejection**

- **As a** Liquidity Provider
- **I want to** have swaps automatically rejected when current rates exceed the swapper's tolerance
- **So that** I don't need to manually check rates and can avoid unfavorable executions

**US-UPD-008: Enhanced Token Recovery**

- **As a** Swapper
- **I want to** have multiple recovery options when swaps are rejected or cancelled
- **So that** I can always reclaim my tokens through reverse locks or cancellation mechanisms

**US-UPD-009: Immediate Token Exchange for LPs**

- **As a** Liquidity Provider
- **I want to** receive input tokens immediately when accepting a swap
- **So that** I can complete my side of the transaction in the first phase

**US-UPD-010: Streamlined Swap Choices**

- **As a** System User
- **I want to** use simplified swap choices (AcceptSwap, FinalizeSwap, CancelSwapRequest, RejectSwapRequest)
- **So that** I can navigate the swap process with clear, intuitive actions
