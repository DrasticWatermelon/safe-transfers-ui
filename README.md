# Safe Transfers

A secure Web3 application for transferring large amounts of ERC20 tokens using an allowance-based approach.

## Problem

When transferring large amounts of cryptocurrency, users face significant anxiety about entering the wrong recipient address. With traditional transfers, if you send tokens to an incorrect address, they're permanently lost with no way to recover them.

## Solution

Safe Transfers uses the ERC20 allowance mechanism (`approve` + `transferFrom`) instead of direct transfers:

1. **Sender**: Grants an allowance to the receiver's address
2. **Receiver**: Pulls the funds using `transferFrom`
3. **Safety**: If the sender enters the wrong address, the pull will fail (since that address likely has no private key), and the sender can revoke the allowance and try again

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Web3 Libraries**: wagmi + viem
- **Wallet Connection**: RainbowKit
- **Styling**: Tailwind CSS
- **Language**: TypeScript

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
   - Amount and decimals (usually 18 for most tokens)
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

1. Revoke the allowance by approving `0` tokens to the incorrect address
2. Grant a new allowance to the correct receiver address
3. The receiver can then pull the funds successfully

## Supported Networks

Safe Transfers works on any EVM-compatible blockchain. The following networks are pre-configured:

### Mainnet Networks
- Ethereum Mainnet
- Polygon
- Arbitrum
- Base
- Optimism
- Avalanche C-Chain
- BNB Smart Chain (BSC)
- Gnosis Chain
- Fantom
- zkSync Era
- Celo
- Aurora
- Harmony One
- Moonbeam
- Moonriver
- Cronos
- Scroll
- Mantle
- Linea
- Polygon zkEVM
- Zora

### Testnets (Development Only)
- Sepolia
- Goerli
- Arbitrum Sepolia
- Base Sepolia
- Optimism Sepolia
- Polygon Mumbai

### Custom Networks
You can add any EVM-compatible chain by:
1. Manually adding the network to your wallet
2. Switching to that network in your wallet
3. Using the app - it will work with any ERC20 token on that chain

## Building for Production

### Local Build
```bash
npm run build
npm start
```

### Static Export for GitHub Pages
This project is configured to export as a static site for GitHub Pages:

```bash
npm run build
```

The static files will be generated in the `out/` directory.

## Deploying to GitHub Pages

This project includes automated deployment to GitHub Pages via GitHub Actions.

### Setup Instructions

1. **Push to GitHub**: Push your code to a GitHub repository

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Build and deployment" > "Source", select "GitHub Actions"

3. **Configure for Repository or Custom Domain**:

   **For repository deployment** (username.github.io/repo-name):
   - Uncomment the `basePath` and `assetPrefix` lines in `next.config.ts`
   - Set them to your repository name (e.g., `/safe-transfers-ui`)

   **For custom domain** (your-domain.com):
   - Keep the config as is
   - Add your custom domain in repository settings

4. **Automatic Deployment**:
   - Every push to the `main` branch will trigger automatic deployment
   - You can also manually trigger deployment from the "Actions" tab

5. **Your site will be live at**:
   - Repository: `https://username.github.io/repo-name`
   - Custom domain: `https://your-domain.com`

## Project Structure

```
safe-transfers-ui/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page with tab navigation
│   ├── providers.tsx       # Web3 providers (Wagmi, RainbowKit)
│   └── globals.css         # Global styles
├── components/
│   ├── SenderView.tsx      # UI for granting allowances
│   └── ReceiverView.tsx    # UI for pulling funds
├── lib/
│   └── wagmi.ts            # Wagmi configuration
└── .env.local              # Environment variables
```

## Security Considerations

- Always verify addresses multiple times before transactions
- Start with small test amounts on testnets
- This method is safer but still requires careful address verification
- The allowance mechanism only protects against typos to addresses with no private key
- Always revoke unused allowances

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
