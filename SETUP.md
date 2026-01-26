# Setup Instructions

## Installing Node.js (Required)

Since Homebrew is not installed, here are the easiest ways to install Node.js:

### Option 1: Direct Download (Easiest)
1. Visit: https://nodejs.org/
2. Download the LTS version for macOS
3. Run the installer (.pkg file)
4. Follow the installation wizard
5. Restart your terminal

### Option 2: Using nvm (Node Version Manager)
If you prefer a version manager:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.zshrc

# Install Node.js
nvm install --lts
nvm use --lts
```

## After Installing Node.js

Once Node.js is installed, run:

```bash
cd /Users/fergflannery/Desktop/work/dev
npm install
npm run dev
```

The app will start at http://localhost:3000

## Optional: OpenAI API Key

For best results, create a `.env.local` file with:
```
OPENAI_API_KEY=your_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys
