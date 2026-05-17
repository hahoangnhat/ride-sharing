#!/bin/bash
set -euo pipefail

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'
ENV_FILE=".env"

# Create .env from .env.example if not exists
if [ ! -f "$ENV_FILE" ]; then
  [ -f ".env.example" ] && cp .env.example "$ENV_FILE" || touch "$ENV_FILE"
fi

# Start supabase
echo -e "${GREEN}→${NC} Starting Supabase..."
if ! supabase start; then
  echo -e "${YELLOW}!${NC} Failed to start. Is Docker running?"
  exit 0
fi

# Get credentials
status=$(supabase status)
URL=$(echo "$status" | grep "Project URL" | awk -F'│' '{print $3}' | xargs)
KEY=$(echo "$status" | grep "Publishable" | awk -F'│' '{print $3}' | xargs)

# Write to .env (replace existing values)
{
  grep -v "NEXT_PUBLIC_SUPABASE_" "$ENV_FILE" 2>/dev/null || true
  echo "NEXT_PUBLIC_SUPABASE_URL=$URL"
  echo "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$KEY"
} > "${ENV_FILE}.tmp" && mv "${ENV_FILE}.tmp" "$ENV_FILE"

echo -e "${GREEN}✓${NC} Supabase configured"
