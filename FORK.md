# Mizan - Fork Attribution

## Overview

**Mizan** is an agentic payment infrastructure for SME cross-border commerce, built on top of **ArcPay**.

This repository is a fork that extends ArcPay with:
- ✦ Corridor configuration system for UAE → Global payments
- ✦ LangGraph multi-agent orchestration layer
- ✦ Kaiz demo application (SME payroll UI)
- ✦ Mizan marketing site

## Original Work: ArcPay

**Repository**: https://github.com/Himess/arcpay (MIT License)
**Author**: Himess
**Awards**: 3 Arc Hackathon Awards (January 2026)
  - Best Dev Tools
  - Best Trustless AI Agent
  - Best Gateway-Based Micropayments

### What ArcPay Provides (Inherited Layer)

The following components are **inherited from ArcPay** with full attribution:

#### Smart Contracts (5 deployed on Arc Testnet)
- `Escrow.sol` → `0x0a982E2250F1C66487b88286e14D965025dD89D2`
- `StreamPayment.sol` → `0x4678D992De548bddCb5Cd4104470766b5207A855`
- `PaymentChannel.sol` → `0x3FF7bC1C52e7DdD2B7B915bDAdBe003037B0FA2E`
- `StealthRegistry.sol` → `0xbC6d02dBDe96caE69680BDbB63f9A12a14F3a41B`
- `AgentRegistry.sol` → `0x5E3ef9A91AD33270f84B32ACFF91068Eea44c5ee`

#### SDK Modules (28 modules)
All modules in `/src/modules/`:
- Payment primitives: escrow, streaming, channels, subscriptions
- Circle integration: bridge, gateway, gas-station, smart-wallet, fx, usyc
- AI/Voice: ai, voice, agent, intent
- Privacy: stealth, privacy
- Utilities: contacts, templates, links, requests, split, invoices, micropayments
- React: React hooks and components

#### Core Infrastructure
- TypeScript SDK client (`/src/core/`)
- Viem/Ethers integration
- Circle API wrappers (Wallets, CCTP, Gateway, FX, USYC)
- x402 micropayment protocol
- Gemini AI integration
- Voice command system
- ERC-4337 paymaster support

## New Work: Mizan Extensions

The following components are **original Mizan contributions**:

### 1. Corridor System (`/src/modules/corridors/`)
- 5 UAE → Global corridor configurations
- Corridor resolver and routing logic
- FX integration for multi-currency flows

### 2. LangGraph Orchestration (`/mizan-orchestration/`)
- Python FastAPI backend
- 5 specialist agents (Supervisor, Classifier, Treasurer, Payables, Gatekeeper)
- LangGraph state machine
- Anthropic Claude integration for reasoning
- Agent action logging and audit trail

### 3. Kaiz Demo App (`/apps/kaiz/`)
- Next.js 15 SME payroll application
- Invoice upload and AI classification
- Multi-corridor payroll execution
- Real-time agent reasoning display
- Transaction history and analytics
- Supabase backend integration

### 4. Mizan Landing Site (`/apps/landing/`)
- Marketing site with hero animation
- Architecture visualization
- Documentation portal
- Attribution and originality transparency

### 5. Documentation (`/docs/mizan/`)
- Corridor configuration guide
- Agent architecture documentation
- Integration examples
- API reference

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  KAIZ DEMO APP                              ✦ NEW           │
│  Next.js · Tailwind · Supabase                              │
│  9 screens of Dubai SME payroll UX                          │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│  MIZAN ORCHESTRATION                        ✦ NEW           │
│  Python · FastAPI · LangGraph · Anthropic Claude            │
│  5 agents · corridor resolver · FX · reasoning log          │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│  ARCPAY SDK (FORK)                          ▿ INHERITED     │
│  TypeScript · Solidity · Circle Wallets · CCTP · x402       │
│  3 prior Arc Hackathon awards · MIT · attribution preserved │
└─────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────┐
│  ARC TESTNET    +    CIRCLE APIs                            │
└─────────────────────────────────────────────────────────────┘
```

## License

This fork maintains the **MIT License** from the original ArcPay project.

New Mizan contributions are also released under **MIT License**.

## Attribution in Code

All original ArcPay files retain their original headers and comments.
New Mizan files include headers indicating they are "Part of Mizan extension to ArcPay".

## Hackathon Submission

**Challenge**: Stablecoins Commerce Stack Challenge (Ignyte × Circle × Arc)
**Tracks**:
  - Track 1: Best Cross-Border Payments & Remittances Experience
  - Track 4: Best Agentic Economy Experience

**Submission Date**: July 2026
**Team**: Ahmed A. (building on Himess/ArcPay foundation)

---

**Infrastructure stands on infrastructure.**

Mizan extends ArcPay's payment primitives with corridor intelligence and multi-agent orchestration—creating the substrate the agentic economy needs for SME commerce.
