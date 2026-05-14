#!/bin/bash

# Auto setup Supabase local + credentials for new developers
# Runs automatically after `pnpm install` via prepare script

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

ENV_FILE=".env"

# Check if already configured
check_configured() {
  if [ -f "$ENV_FILE" ] && grep -q "NEXT_PUBLIC_SUPABASE_URL=" "$ENV_FILE" && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=" "$ENV_FILE"; then
    echo -e "${GREEN}✓${NC} Supabase already configured"
    exit 0
  fi
}

# Check if supabase CLI exists
check_cli() {
  if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}!${NC} Supabase CLI not found. Skipping setup."
    echo -e "${YELLOW}!${NC} Install: npm install -g supabase"
    exit 0
  fi
}

# Start supabase
start_supabase() {
  echo -e "${GREEN}→${NC} Starting Supabase..."
  if ! supabase start > /dev/null 2>&1; then
    echo -e "${YELLOW}!${NC} Failed to start Supabase. Is Docker running?"
    exit 0
  fi
}

# Get credentials
get_credentials() {
  local status
  status=$(supabase status)

  URL=$(echo "$status" | grep "API URL:" | awk '{print $3}')
  KEY=$(echo "$status" | grep "anon key:" | awk '{print $3}')

  if [ -z "$URL" ] || [ -z "$KEY" ]; then
    echo -e "${YELLOW}!${NC} Could not parse credentials"
    exit 1
  fi
}

# Write to .env
write_env() {
  if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
  fi

  # Remove old values
  sed -i '' '/NEXT_PUBLIC_SUPABASE_URL=/d' "$ENV_FILE" 2>/dev/null || true
  sed -i '' '/NEXT_PUBLIC_SUPABASE_ANON_KEY=/d' "$ENV_FILE" 2>/dev/null || true

  # Append new values
  {
    echo ""
    echo "# Supabase (auto-generated)"
    echo "NEXT_PUBLIC_SUPABASE_URL=$URL"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$KEY"
  } >> "$ENV_FILE"

  echo -e "${GREEN}✓${NC} Supabase configured"
  echo "  URL: $URL"
}

# Main
check_cli
check_configured
start_supabase
get_credentials
write_env
