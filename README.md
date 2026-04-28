<p align="center">
  <img src="payment-tracking-app/docs/logo.png" alt="LedgerLink Logo" width="600" />
</p>

<h1 align="center">LedgerLink — On-Chain Payment Tracking System</h1>

<p align="center">
  <strong>A decentralized invoice management and payment tracking application built on Nero's EVM smart contract platform.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nero-EVM-green?style=for-the-badge&logo=nero&logoColor=white" alt="Nero EVM" />
  <img src="https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Solidity-Smart%20Contract-orange?style=for-the-badge&logo=rust&logoColor=white" alt="Solidity" />
  <img src="https://img.shields.io/badge/Vite-8.x-purple?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Network-Testnet-yellow?style=for-the-badge" alt="Testnet" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-smart-contract">Smart Contract</a> •
  <a href="#-api-reference">API Reference</a>
</p>

---

## 📖 Overview

**LedgerLink** is a full-stack decentralized application (dApp) that enables users to create, manage, and track invoices directly on the Nero blockchain. It leverages **EVM smart contracts** for immutable on-chain storage and the **MetaMask wallet** for secure transaction signing.

The application provides a premium landing page experience alongside a fully functional dApp interface with three core modules: **Invoice Creation**, **Payment Actions**, and **Financial Queries**.

### Key Highlights

- 🔗 **On-chain invoice storage** — All invoices are stored immutably on Nero's EVM smart contract
- ⚡ **~3 second settlement** — Near-instant transaction finality on Nero Testnet
- 💰 **$0.01 per transaction** — Ultra-low cost operations on the Nero network
- 🔐 **Cryptographic authentication** — All write operations require wallet-signed authorization
- 📊 **Real-time queries** — Read contract state directly without wallet connection

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Invoice Creation** | Issue invoices with immutable on-chain records — set amount, recipient, due date, and description |
| **Payment Marking** | Record partial or full payments with timestamps for complete audit trails |
| **Overdue Tracking** | Issuers can flag invoices as overdue when due dates pass |
| **Invoice Cancellation** | Cancel unpaid invoices with issuer authority — immutable once cancelled |
| **Outstanding Balance** | Query total outstanding across all active invoices in one call |
| **Issuer Authentication** | All write operations require cryptographic signatures — no admin keys needed |

### Invoice Lifecycle States

```
┌──────────┐    mark_paid     ┌──────────┐
│ PENDING  │ ───────────────► │   PAID   │
└──────────┘                  └──────────┘
     │                              
     │ mark_overdue                 
     ▼                              
┌──────────┐                        
│ OVERDUE  │                        
└──────────┘                        
     │                              
     │ cancel_invoice               
     ▼                              
┌───────────┐                       
│ CANCELLED │◄──── cancel_invoice ── PENDING
└───────────┘                       
```

---

## 🏗 System Architecture

LedgerLink follows a **four-layer architecture** that cleanly separates the user-facing presentation, the blockchain integration logic, the network communication, and the on-chain smart contract. Each layer has a well-defined responsibility and communicates with the adjacent layers through clearly defined interfaces.

### Layer 1 — Client Layer (Presentation)

The client layer is everything the user sees and interacts with in the browser. It is composed of three distinct modules:

#### 1.1 Landing Page (`index.html`)

The landing page is a **standalone, self-contained HTML file** (no framework dependency) that serves as the marketing front for LedgerLink. It includes:

- **Navigation bar** — Sticky header with the LedgerLink brand mark, links to Features, How It Works, Docs, and an "Open App" CTA button.
- **Hero section** — Full-viewport hero with an animated "Live on Nero Testnet" pill badge, the headline "Invoice tracking, *on-chain*", a subheading, and primary/secondary action buttons.
- **Statistics strip** — Four key metrics displayed in a horizontal strip: ~3s settlement time, $0.01 per transaction, 100% on-chain records, and 4 invoice states.
- **Features grid** — Six feature cards in a 3-column CSS grid layout: Invoice Creation, Payment Marking, Overdue Tracking, Invoice Cancellation, Outstanding Balance, and Issuer Auth. Each card includes an SVG icon, title, and description.
- **How It Works section** — A two-column layout with a 4-step workflow (Connect Wallet → Create Invoice → Track & Manage → Query Ledger) on the left and a mock app preview with sample invoice data on the right.
- **CTA section** — A closing call-to-action with a radial gradient glow, the contract badge showing the deployed Contract ID, and a "Open LedgerLink" button.
- **Footer** — Copyright, Nero EVM attribution, and links to GitHub, Testnet Explorer, and Documentation.

When the user clicks "Launch App" or "Open App", the JavaScript function `openDapp()` hides the landing page and reveals the dApp interface by toggling CSS classes — there is no page navigation, just DOM visibility switching.

#### 1.2 React dApp (`src/App.jsx`)

The React dApp is a **Vite-powered React 19 application** that serves as the primary functional interface. It uses a tab-based navigation pattern and consists of:

- **Wallet Status Bar** — A sticky top bar showing connection status. When disconnected, it shows a red status dot, "Not Connected" label, and a "Connect MetaMask" button. When connected, it displays a green status dot, the truncated wallet address (first 8 + last 4 characters), and a green "Connected" badge.
- **Create Invoice Tab** — A form with six fields: Invoice ID (text, max 32 chars), Due Date (Unix timestamp with helper text showing the human-readable date), Issuer address (auto-filled from connected wallet), Recipient address, Description (textarea), and Amount (number input with currency prefix showing Wei). The form uses a 2-column CSS grid layout with the description spanning both columns.
- **Payment Actions Tab** — A dark-themed panel with three sub-sections: (a) Payer address, Paid Amount, and Paid At fields for the Mark Paid action; (b) a Mark Overdue button; and (c) a Cancel Invoice button with a **double-click confirmation pattern** — the first click changes the button text to "Confirm Cancel?" with a pulse animation, and only a second click within 3 seconds executes the cancellation.
- **Queries Tab** — Three query card buttons: Lookup Invoice (with an inline Invoice ID input), All Invoices (lists all stored IDs), and Outstanding Total (sums unpaid amounts). No wallet connection is required for read-only queries.
- **Transaction Log** — A dark-themed output panel at the bottom of every tab that displays the raw JSON result or error message from each operation. The left border changes color: green for success, red for error, and neutral for idle. All output is rendered as a `<pre>` block with monospace font.

The React app manages state using `useState` hooks for form fields, wallet connection status, loading states, active tab, and the confirmation flow. All blockchain interactions are dispatched through the `runAction()` wrapper function, which handles loading spinners, error catching, and output rendering.

#### 1.3 MetaMask Wallet (Browser Extension)

The [MetaMask browser extension](https://www.metamask.app/) is the third client-side component. It is not part of this codebase but is a **required external dependency** for all write operations. MetaMask provides:

- **Key management** — Stores the user's Nero keypair (public + secret key) securely in the browser extension.
- **Transaction signing** — When the dApp needs to submit a transaction, it sends the unsigned XDR to MetaMask, which prompts the user for approval and returns the signed XDR.
- **Network configuration** — The user selects Nero Testnet or Mainnet within MetaMask settings. The dApp checks that the network matches the expected `NETWORK_PASSPHRASE`.

---

### Layer 2 — Integration Layer (`lib/nero.js`)

The integration layer is a single JavaScript module (`lib/nero.js`, ~150 lines) that acts as the **bridge between the React UI and the Nero blockchain**. It encapsulates all Nero SDK operations and MetaMask API interactions so that the UI components never deal with raw XDR, EVM type encoding, or RPC calls directly.

The module provides:

#### Wallet Connection

- **`checkConnection()`** — Calls the MetaMask API's `isAllowed()` to check if the dApp is permitted by the extension, then `requestAccess()` to get the user's public key. Returns `{ publicKey: string }` on success or `null` if the wallet is not connected or the user denies access.

#### Write Operations (State-Changing Transactions)

All write operations flow through the internal `invokeWrite(method, args)` function, which follows this exact sequence:

1. **Connection check** — Calls `checkConnection()` to verify the MetaMask wallet is connected. Throws an error if not.
2. **Account fetch** — Calls `server.getAccount(publicKey)` on the EVM RPC server to get the user's current sequence number.
3. **Transaction building** — Uses Nero SDK's `TransactionBuilder` to construct a transaction with a fee of 10,000 Wei, the correct network passphrase, the smart contract method call (via `new Contract(CONTRACT_ID).call(method, ...args)`), and a 30-second timeout.
4. **Transaction preparation** — Calls `server.prepareTransaction(tx)` to simulate the transaction on the EVM RPC, attach the required footprint and resource fees.
5. **Transaction signing** — Sends the prepared XDR to MetaMask via `signTransaction(tx.toXDR(), { networkPassphrase })`. The user sees a MetaMask popup to approve/reject.
6. **Transaction submission** — Calls `server.sendTransaction()` with the signed XDR. If the status is `"ERROR"`, throws immediately with the error result.
7. **Confirmation polling** — Calls the internal `waitForTx(hash)` function, which polls `server.getTransaction(hash)` every 2 seconds up to 30 attempts (60 seconds max). Returns the transaction result on `"SUCCESS"`, throws on `"FAILED"`.

The exported write functions (`createInvoice`, `markPaid`, `markOverdue`, `cancelInvoice`) are thin wrappers around `invokeWrite()` that validate input parameters and convert JavaScript values to EVM-compatible EVM type types using:

- `xdr.EVM type.scvstring()` — For invoice IDs (string type)
- `nativeToEVM type(BigInt(value), { type: "uint256" })` — For monetary amounts
- `nativeToEVM type(BigInt(value), { type: "uint256" })` — For timestamps
- `new address(publicKey).toEVM type()` — For Nero addresses
- `nativeToEVM type(string)` — For description strings

#### Read Operations (Simulation-Only Queries)

All read operations flow through the internal `invokeRead(method, args)` function:

1. **Transaction building** — Constructs a transaction using a hardcoded demo address (`DEMO_ADDR`) with sequence number "0", a minimal fee of 100 Wei, and a timeout of 0 (no expiry needed since this is simulation-only).
2. **Simulation** — Calls `server.simulateTransaction(tx)` on the EVM RPC. This executes the contract function in a read-only simulation without actually submitting a transaction to the network.
3. **Result decoding** — If the simulation succeeds, decodes the return value from EVM's `EVM type` format to native JavaScript using `scValToNative(sim.result.retval)`.

The exported read functions (`getInvoice`, `listInvoices`, `getTotalOutstanding`) are simple wrappers that pass the correct method name and arguments.

---

### Layer 3 — Network Layer (Nero EVM RPC)

The network layer is the **EVM RPC server** hosted at `https://evm-testnet.nero.org`. This is Nero Development Foundation's public testnet RPC endpoint. The application communicates with it via the Nero SDK's `rpc.Server` class.

The RPC server provides five critical operations used by the integration layer:

| RPC Method | Used By | Purpose |
|------------|---------|--------|
| `getAccount(publicKey)` | `invokeWrite()` | Fetches the account's current sequence number to build valid transactions |
| `prepareTransaction(tx)` | `invokeWrite()` | Simulates the transaction and attaches resource costs, storage footprint, and EVM authorization |
| `sendTransaction(signedTx)` | `invokeWrite()` | Submits the signed transaction to the Nero network for inclusion in the ledger |
| `simulateTransaction(tx)` | `invokeRead()` | Executes a contract function in read-only mode without submitting to the ledger |
| `getTransaction(hash)` | `waitForTx()` | Polls for the result of a submitted transaction by its hash |

All network communication is done over HTTPS. The RPC server acts as a gateway to the Nero Testnet validator nodes — it does not store any application data itself.

---

### Layer 4 — Blockchain Layer (EVM Smart Contract)

The blockchain layer is the **EVM smart contract** deployed on the Nero Testnet. It is the single source of truth for all invoice data.

#### Contract Identity

- **Contract ID:** `CC3I2WDHMF3CVL7HQDYJ6IIWUWIJN6LWJDGUO6CVF3QLZQK2AK2H3NBX`
- **Language:** Solidity (compiled to WASM with `#![no_std]`)
- **SDK:** EVM SDK v23
- **Compilation target:** `evm-bytecode`

#### On-Chain Data Model

The contract uses EVM's **instance storage** (persistent for the contract's lifetime) with a custom `DataKey` enum for key management:

- **`DataKey::IdList`** — Stores a `Vec<string>` containing all invoice IDs that have ever been created. This allows the `list_invoices()` function to enumerate all invoices without external indexing. New IDs are appended on creation; IDs are never removed (even for cancelled invoices).

- **`DataKey::Invoice(string)`** — Stores an `Invoice` struct for each invoice, keyed by its unique string ID. The `Invoice` struct contains 9 fields:

  | Field | Type | Description |
  |-------|------|-------------|
  | `issuer` | `address` | The Nero address of the invoice creator. Used for authorization checks on overdue/cancel operations. |
  | `recipient` | `address` | The Nero address of the payment recipient. |
  | `description` | `String` | A freeform text description of the service or payment. Must be non-empty. |
  | `amount` | `uint256` | The total invoice amount in Wei (1 NERO = 10,000,000 Wei). Must be greater than zero. |
  | `paid_amount` | `uint256` | The amount that has been paid. Initialized to 0 on creation, set upon `mark_paid`. |
  | `status` | `string` | Current invoice state: `"pending"`, `"paid"`, `"overdue"`, or `"cancelled"`. |
  | `due_date` | `uint256` | The invoice due date as a Unix timestamp in seconds. |
  | `created_at` | `uint256` | The creation timestamp, automatically set from the ledger timestamp (`env.ledger().timestamp()`). |
  | `paid_at` | `uint256` | The payment timestamp. Initialized to 0, set upon `mark_paid`. |

#### Contract Functions and Authorization

The contract exposes 7 public functions, split into write operations (which require MetaMask-signed authorization) and read operations (which can be simulated without a wallet):

**Write operations:**

1. **`create_invoice(id, issuer, recipient, description, amount, due_date)`** — The `issuer` address must sign the transaction (`issuer.require_auth()`). Validates that the description is non-empty and the amount is positive. Creates an `Invoice` struct with status `"pending"`, `paid_amount` of 0, and `created_at` from the ledger timestamp. Stores the invoice under `DataKey::Invoice(id)` and appends the ID to `DataKey::IdList` if it doesn't already exist.

2. **`mark_paid(id, payer, paid_amount, paid_at)`** — The `payer` address must sign the transaction. Loads the invoice by ID (throws `InvoiceNotFound` if missing). Rejects if the invoice is already `"paid"` or `"cancelled"`. Updates `paid_amount`, sets status to `"paid"`, and records `paid_at`.

3. **`mark_overdue(id, issuer)`** — The `issuer` address must sign the transaction. Loads the invoice and verifies the caller matches `invoice.issuer` (throws `NotIssuer` otherwise). Changes the status to `"overdue"`.

4. **`cancel_invoice(id, issuer)`** — The `issuer` address must sign the transaction. Verifies the caller is the issuer. Rejects if the invoice is already `"paid"` (throws `AlreadyPaid`). Changes the status to `"cancelled"`.

**Read operations:**

5. **`get_invoice(id) → Option<Invoice>`** — Returns the full `Invoice` struct for the given ID, or `None` if it doesn't exist.

6. **`list_invoices() → Vec<string>`** — Returns the complete list of all invoice IDs stored in `DataKey::IdList`.

7. **`get_total_outstanding() → uint256`** — Iterates over all invoice IDs, loads each invoice, filters out those with status `"paid"` or `"cancelled"`, and sums `(amount - paid_amount)` for the remaining invoices. Returns the total outstanding balance in Wei.

#### Error Handling

The contract defines 7 custom error codes via the `ContractError` enum (values 1–7). When an error condition is met, the contract calls `panic_with_error!()` which aborts the transaction and returns the error code to the caller. The frontend's `invokeWrite()` function catches these as exceptions and displays the error message in the Transaction Log panel.

---

### End-to-End Data Flow

#### Write Flow (e.g., Creating an Invoice)

The complete journey from user action to on-chain state change follows this path:

1. **User fills the form** in the React dApp (Invoice ID, amounts, addresses, description, due date).
2. **React `onChange` handlers** update the component's `form` state via `setForm()`.
3. **User clicks "Create Invoice"** → calls `onCreateInvoice()` → calls `runAction("createInvoice", ...)` → sets loading state and disables the button.
4. **`createInvoice()` in `lib/nero.js`** validates input parameters, then calls `invokeWrite("create_invoice", [...scValArgs])`.
5. **`invokeWrite()` checks wallet connection** via MetaMask's `isAllowed()` + `requestAccess()`.
6. **Fetches the user's account** from the EVM RPC (`server.getAccount()`).
7. **Builds the transaction** using `TransactionBuilder` with the contract call operation.
8. **Prepares the transaction** via `server.prepareTransaction()` (simulation + footprint attachment).
9. **Sends to MetaMask for signing** → user sees a popup in the MetaMask extension and clicks Approve.
10. **Submits the signed transaction** to the Nero network via `server.sendTransaction()`.
11. **Polls for confirmation** via `waitForTx()` — checks `server.getTransaction(hash)` every 2 seconds.
12. **On success** — the Transaction Log shows the result, the status indicator turns green, and the loading spinner stops.
13. **On failure** — the error message is displayed in red, and the user can modify inputs and retry.

#### Read Flow (e.g., Looking Up an Invoice)

The read path is simpler because no wallet or signing is needed:

1. **User clicks "Look Up"** in the Queries tab → calls `onGetInvoice()`.
2. **`getInvoice(id)` in `lib/nero.js`** calls `invokeRead("get_invoice", [tostring(id)])`.
3. **`invokeRead()` builds a simulation-only transaction** using the hardcoded `DEMO_ADDR` (no real account needed).
4. **Sends to EVM RPC** via `server.simulateTransaction()` — the contract function runs in read-only mode.
5. **Decodes the result** from EVM type to native JavaScript via `scValToNative()`.
6. **Displays the JSON result** in the Transaction Log panel.

---

### Smart Contract Storage Model

The contract uses EVM's **instance storage**, which persists for the lifetime of the contract instance. All data is stored as key-value pairs where keys are variants of the `DataKey` enum:

- **`DataKey::IdList`** → A `Vec<string>` containing all invoice IDs (e.g., `["inv1", "inv2", "inv3"]`). Grows with each new invoice. Never shrinks.
- **`DataKey::Invoice("inv1")`** → A full `Invoice` struct with all 9 fields. Updated in-place when the status changes (mark paid, mark overdue, cancel).
- **`DataKey::Invoice("inv2")`** → Another `Invoice` struct, and so on for each created invoice.

This flat key-value model ensures O(1) lookup for individual invoices and O(n) iteration for aggregate queries like `get_total_outstanding()`.

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite 8 | Component UI with HMR |
| **Landing Page** | Vanilla HTML/CSS/JS | Standalone marketing page |
| **Styling** | Custom CSS + Google Fonts | Instrument Serif, DM Mono, Geist |
| **Wallet** | MetaMask API v6 | Browser extension wallet integration |
| **SDK** | Nero SDK v14 | Transaction building and RPC communication |
| **Smart Contract** | Solidity + EVM SDK 23 | On-chain business logic |
| **Compilation** | WASM (evm-bytecode) | Contract compilation target |
| **Network** | Nero Testnet | Blockchain deployment |
| **RPC** | evm-testnet.nero.org | EVM RPC endpoint |

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your system:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | ≥ 18.x | JavaScript runtime |
| [npm](https://www.npmjs.com/) | ≥ 9.x | Package manager |
| [Solidity](https://www.rust-lang.org/tools/install) | Latest stable | Smart contract development |
| [Nero CLI](https://developers.nero.org/docs/tools/developer-tools#nero-cli) | Latest | Contract build & deploy |
| [MetaMask Wallet](https://www.metamask.app/) | Latest | Browser extension for Nero |

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pratyush06-aec/payment-tracking-app.git
   cd payment-tracking-app/nero-payment-tracking
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173/`

4. **Configure MetaMask Wallet**

   - Install the [MetaMask browser extension](https://www.metamask.app/)
   - Switch to **Nero Testnet** in MetaMask settings
   - Fund your testnet account using the [Nero Friendbot](https://friendbot.nero.org/?addr=YOUR_PUBLIC_KEY)

### Build for Production

```bash
npm run build
npm run preview
```

The production build will be output to the `dist/` directory.

---

## 📜 Smart Contract

### Contract Overview

The smart contract is written in **Solidity** using the **EVM SDK v23** and implements a payment tracking system with full CRUD operations for invoices.

- **Contract ID:** `CC3I2WDHMF3CVL7HQDYJ6IIWUWIJN6LWJDGUO6CVF3QLZQK2AK2H3NBX`
- **Network:** Nero Testnet
- **Language:** Solidity
- **Compilation Target:** `evm-bytecode`

### Contract Structure

```
contract/
├── hardhat.config.js                      # Workspace configuration
├── README.md                       # Contract-specific docs
└── contracts/
    └── hello-world/
        ├── hardhat.config.js              # Contract dependencies
        ├── Makefile                 # Build automation
        └── src/
            ├── lib.rs              # Main contract logic (200 lines)
            └── test.rs             # Unit tests
```

### Building the Contract

```bash
cd contract
nero contract build
```

The compiled WASM will be output to `target/evm-bytecode/release/`.

### Deploying the Contract

```bash
# Deploy to testnet
nero contract deploy \
  --wasm target/evm-bytecode/release/hello_world.wasm \
  --source YOUR_SECRET_KEY \
  --network testnet

# The command outputs the new Contract ID — update CONTRACT_ID in lib/nero.js
```

### Data Types

#### Invoice Struct

```rust
pub struct Invoice {
    pub issuer: address,       // Creator of the invoice
    pub recipient: address,    // Payment recipient
    pub description: String,   // Service description
    pub amount: uint256,          // Total amount in Wei
    pub paid_amount: uint256,     // Amount paid (0 initially)
    pub status: string,        // "pending" | "paid" | "overdue" | "cancelled"
    pub due_date: uint256,         // Due date (Unix timestamp)
    pub created_at: uint256,       // Creation time (ledger timestamp)
    pub paid_at: uint256,          // Payment time (0 if unpaid)
}
```

#### Error Codes

| Code | Name | Description |
|------|------|-------------|
| 1 | `InvalidDescription` | Description is empty |
| 2 | `InvalidTimestamp` | Invalid timestamp value |
| 3 | `InvoiceNotFound` | Invoice ID doesn't exist |
| 4 | `NotIssuer` | Caller is not the invoice issuer |
| 5 | `AlreadyPaid` | Invoice has already been paid |
| 6 | `AlreadyCancelled` | Invoice was previously cancelled |
| 7 | `InvalidAmount` | Amount is zero or negative |

---

## 📚 API Reference

### Smart Contract Functions

#### Write Operations (require wallet authentication)

##### `create_invoice(id, issuer, recipient, description, amount, due_date)`

Creates a new invoice and stores it on-chain.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique invoice identifier (max 32 chars) |
| `issuer` | `address` | Creator's Nero public key (requires auth) |
| `recipient` | `address` | Payment recipient's public key |
| `description` | `String` | Service/payment description |
| `amount` | `uint256` | Total amount in Wei (1 NERO = 10,000,000) |
| `due_date` | `uint256` | Due date as Unix timestamp |

##### `mark_paid(id, payer, paid_amount, paid_at)`

Records payment against an invoice.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Invoice ID to mark as paid |
| `payer` | `address` | Payer's Nero public key (requires auth) |
| `paid_amount` | `uint256` | Amount being paid in Wei |
| `paid_at` | `uint256` | Payment timestamp |

##### `mark_overdue(id, issuer)`

Flags an invoice as overdue. Only the original issuer can perform this action.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Invoice ID to mark overdue |
| `issuer` | `address` | Must match original invoice issuer |

##### `cancel_invoice(id, issuer)`

Cancels an unpaid invoice. Cannot cancel already-paid invoices.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Invoice ID to cancel |
| `issuer` | `address` | Must match original invoice issuer |

#### Read Operations (no wallet required)

##### `get_invoice(id) → Option<Invoice>`

Returns all fields for a specific invoice by ID.

##### `list_invoices() → Vec<string>`

Returns all invoice IDs stored in the contract.

##### `get_total_outstanding() → uint256`

Calculates and returns the sum of all unpaid amounts across active (non-cancelled, non-paid) invoices.

### Frontend Integration Library (`lib/nero.js`)

The frontend communicates with the smart contract through helper functions in `lib/nero.js`:

```javascript
import { 
  checkConnection,      // Check/request MetaMask wallet connection
  createInvoice,        // Create new invoice on-chain
  markPaid,             // Mark invoice as paid
  markOverdue,          // Flag invoice as overdue
  cancelInvoice,        // Cancel an invoice
  getInvoice,           // Query single invoice
  listInvoices,         // List all invoice IDs
  getTotalOutstanding   // Get total outstanding balance
} from './lib/nero.js';
```

---

## 📁 Project Structure

```
payment-tracking-app/
├── index.html                  # Landing page + dApp (standalone HTML)
├── package.json                # Node.js dependencies and scripts
├── vite.config.js              # Vite build configuration
├── eslint.config.js            # ESLint configuration
├── .gitignore                  # Git ignore rules
│
├── src/                        # React application source
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles (Ledger theme)
│   ├── index.css               # Global base styles
│   └── assets/                 # Static assets
│       ├── diagram-export-...  # System architecture diagram (source)
│       ├── hero.png            # Hero image
│       ├── react.svg           # React logo
│       └── vite.svg            # Vite logo
│
├── lib/                        # Integration libraries
│   └── nero.js              # Nero SDK + MetaMask integration
│
├── public/                     # Public static files
│   ├── favicon.svg             # Site favicon
│   ├── icons.svg               # Icon sprites
│   ├── image.png               # Preview images
│   └── image copy.png          # Additional images
│
├── contract/                   # EVM smart contract
│   ├── hardhat.config.js              # Solidity workspace config
│   ├── README.md               # Contract documentation
│   └── contracts/
│       └── hello-world/
│           ├── hardhat.config.js      # Contract dependencies
│           ├── Makefile         # Build automation
│           └── src/
│               ├── lib.rs      # Contract implementation
│               └── test.rs     # Unit tests
│
└── docs/                       # Documentation assets
    ├── logo.png                # Project logo
    ├── system-architecture.png # System architecture diagram
    └── screenshots/            # Application screenshots
        ├── landing-page.png
        ├── features-section.png
        ├── dapp-create-invoice.png
        ├── dapp-payment-actions.png
        ├── dapp-queries.png
        └── app-walkthrough.webp
```

---

## 🔧 Configuration

### Environment Variables

The following constants can be modified in `lib/nero.js`:

| Constant | Default Value | Description |
|----------|---------------|-------------|
| `CONTRACT_ID` | `CC3I2W...H3NBX` | Deployed EVM contract ID |
| `DEMO_ADDR` | `GBABH...F4LA` | Demo address for read operations |
| `RPC_URL` | `https://evm-testnet.nero.org` | EVM RPC endpoint |
| `NETWORK_PASSPHRASE` | `Test SDF Network ; September 2015` | Nero network identifier |

### Switching to Mainnet

To deploy on Nero mainnet:

1. Update `RPC_URL` to a mainnet EVM RPC endpoint
2. Change `NETWORK_PASSPHRASE` to `Networks.PUBLIC`
3. Deploy the contract to mainnet and update `CONTRACT_ID`
4. Configure MetaMask to use Nero Mainnet

---

## 🧪 Testing

### Contract Unit Tests

```bash
cd contract
cargo test
```

### Frontend Linting

```bash
npm run lint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Nero Development Foundation](https://nero.org/) — Blockchain platform
- [EVM](https://evm.nero.org/) — Smart contract framework
- [MetaMask](https://www.metamask.app/) — Nero wallet extension
- [Vite](https://vitejs.dev/) — Frontend build tool
- [React](https://react.dev/) — UI library

---

<p align="center">
  <strong>Built with ❤️ on Nero EVM</strong>
</p>
