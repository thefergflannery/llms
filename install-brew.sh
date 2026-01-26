#!/bin/bash

# Homebrew Installation Script
# Run this in your terminal: bash install-brew.sh

echo "Installing Homebrew..."
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

echo ""
echo "Homebrew installation complete!"
echo ""
echo "After installation, you may need to add Homebrew to your PATH."
echo "The installer will show you the commands to run (usually something like):"
echo '  echo '\''eval "$(/opt/homebrew/bin/brew shellenv)"'\'' >> ~/.zshrc'
echo '  eval "$(/opt/homebrew/bin/brew shellenv)"'
echo ""
echo "Then install Node.js with:"
echo "  brew install node"
