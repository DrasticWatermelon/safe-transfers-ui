# Safe Transfers

A secure Web3 application for transferring large amounts of ERC20 tokens using an allowance-based approach.

## Problem

When transferring large amounts of cryptocurrency, users face significant anxiety about entering the wrong recipient address. With traditional transfers, if you send tokens to an incorrect address, they're permanently lost with no way to recover them.

## Solution

Safe Transfers uses the ERC20 allowance mechanism (`approve` + `transferFrom`) instead of direct transfers:

1. **Sender**: Grants an allowance to the receiver's address
2. **Receiver**: Pulls the funds using `transferFrom`
3. **Safety**: If the sender enters the wrong address, the pull will fail (since that address likely has no known private key), and the sender can revoke the allowance and try again

## Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Rainbow, Coinbase Wallet, etc.)
- A WalletConnect Project ID (free at [cloud.walletconnect.com](https://cloud.walletconnect.com))

## Getting Started

### 1. Install Dependencies

```bash
cd safe-transfers-ui
npm install
```

### 2. Configure Environment

Create a `.env.local` file (already created) and add your WalletConnect Project ID:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your free project ID at [cloud.walletconnect.com](https://cloud.walletconnect.com)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### For Senders

1. Connect your wallet using the "Connect Wallet" button
2. Click "I'm Sending" tab
3. Enter:
   - Token contract address (the ERC20 token you want to send)
   - Receiver's address (double-check this!)
   - Amount and decimals (usually 18 for most tokens, UI will do its best to auto-detect decimals)
4. Click "Approve Allowance" and confirm the transaction
5. Wait for confirmation
6. Share your address with the receiver so they can pull the funds

### For Receivers

1. Connect your wallet using the "Connect Wallet" button
2. Click "I'm Receiving" tab
3. Enter:
   - Token contract address (same as sender used)
   - Sender's address (who granted you the allowance)
   - Amount and decimals (same as the allowance granted)
4. Click "Pull Funds" and confirm the transaction
5. Funds will be transferred to your connected wallet

### If Something Goes Wrong

If the receiver cannot pull the funds, the sender likely entered the wrong address. The sender can:

1. Revoke the allowance by approving `0` tokens to the incorrect address (or use [revoke.cash](revoke.cash))
2. Grant a new allowance to the correct receiver address
3. The receiver can then pull the funds successfully

## Security Considerations

- 🚨 The allowance mechanism only protects against typos to addresses with no private key
- 🚨 Always revoke unused allowances
- 🚨 Always verify addresses multiple times before sending transactions
- 🚨 Start with small test amounts
- 🚨 This method is safer but still requires careful address verification

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request ❤️
