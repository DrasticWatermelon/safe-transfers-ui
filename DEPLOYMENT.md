# Deployment Guide for GitHub Pages

## ✅ Configuration Complete

Your Safe Transfers UI is fully configured for GitHub Pages deployment!

## Quick Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add GitHub Pages deployment configuration"
git push origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment" → **Source** → Select **GitHub Actions**

### 3. Automatic Deployment
- Every push to `main` branch triggers automatic deployment
- Check the **Actions** tab to see deployment progress
- Site will be live in ~2-3 minutes

## Deployment Options

### Option A: Custom Domain (e.g., safetransfers.com)
**Current Configuration** - No changes needed!
- Keep `next.config.ts` as is
- Add your custom domain in GitHub Pages settings
- Site will be available at: `https://your-domain.com`

### Option B: Repository Path (e.g., username.github.io/safe-transfers)
**Requires Configuration Change:**

1. Edit `next.config.ts` and uncomment these lines:
   ```typescript
   basePath: '/your-repo-name',
   assetPrefix: '/your-repo-name/',
   ```
   Replace `your-repo-name` with your actual repository name.

2. Commit and push changes
3. Site will be available at: `https://username.github.io/your-repo-name`

## Build Configuration

The project is configured with:
- ✅ Static export enabled (`output: 'export'`)
- ✅ Image optimization disabled (required for static export)
- ✅ External packages configured (pino, thread-stream)
- ✅ `.nojekyll` file included (bypasses Jekyll processing)
- ✅ GitHub Actions workflow ready

## Local Build Test

Test the static export locally:
```bash
npm run build
```

Files will be generated in the `out/` directory.

## Environment Variables

Don't forget to add your WalletConnect Project ID:
- Create `.env.local` for local development
- Get your project ID at: https://cloud.walletconnect.com

**Note:** Environment variables prefixed with `NEXT_PUBLIC_` are embedded in the build and will be publicly visible.

## Troubleshooting

### Build fails in GitHub Actions
- Check the Actions tab for error logs
- Ensure all dependencies are in `package.json`
- Verify `package-lock.json` is committed

### Site shows 404
- Verify GitHub Pages is enabled
- Check the correct source (GitHub Actions) is selected
- For repository deployment, ensure `basePath` is configured

### Styles not loading
- Clear browser cache
- Check if `assetPrefix` is configured correctly for repository deployment

## Support

For issues or questions:
- Check Next.js static export docs: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- GitHub Pages docs: https://docs.github.com/en/pages

## What's Included

- 📦 Next.js 16 with Turbopack
- 🎨 Tailwind CSS v4 with dark mode
- 🌐 20+ EVM chains pre-configured
- 💼 RainbowKit wallet connection
- 🔄 Automatic decimals detection
- ✅ Allowance checking for receivers
- 🚀 GitHub Actions deployment workflow
