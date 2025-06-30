#!/bin/sh
# Copy pre-push hook to .git/hooks and make it executable
cp scripts/git-hooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push

echo "Git pre-push hook installed!"
