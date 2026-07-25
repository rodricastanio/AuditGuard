#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
FIXTURES_DIR="$ROOT_DIR/tests/fixtures"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0
SKIP=0

log_pass() { echo -e "${GREEN}PASS${NC}: $1"; ((PASS++)); }
log_fail() { echo -e "${RED}FAIL${NC}: $1"; ((FAIL++)); }
log_skip() { echo -e "${YELLOW}SKIP${NC}: $1"; ((SKIP++)); }

echo "=== AuditGuard Fixture Validation ==="
echo ""

# --- ESLint Fixtures ---
echo "--- ESLint Fixtures ---"
for fixture_dir in "$FIXTURES_DIR"/eslint/*/; do
  rule=$(basename "$fixture_dir")

  if [ ! -f "$fixture_dir/vulnerable.ts" ] && [ ! -f "$fixture_dir/vulnerable.js" ]; then
    log_skip "$rule: no vulnerable file found"
    continue
  fi

  vulnerable_file=$(ls "$fixture_dir"/vulnerable.{ts,js} 2>/dev/null | head -1)
  safe_file=$(ls "$fixture_dir"/safe.{ts,js} 2>/dev/null | head -1)

  if [ ! -f "$safe_file" ]; then
    log_skip "$rule: no safe file found"
    continue
  fi

  # Check that vulnerable file contains the rule-disabling comment or the pattern
  if grep -q "eslint-disable" "$vulnerable_file" 2>/dev/null; then
    log_pass "$rule: vulnerable file has disable comment (expected for fixture)"
  elif grep -qE "(eval\(|exec\(|new Buffer|pseudoRandom|require\(|location\.href)" "$vulnerable_file" 2>/dev/null; then
    log_pass "$rule: vulnerable file contains expected pattern"
  else
    log_fail "$rule: vulnerable file does not contain expected pattern"
  fi

  # Check that safe file does NOT contain the dangerous pattern
  if grep -qE "(eval\(|exec\([^)]*\)|new Buffer|pseudoRandom|require\([^\"'])" "$safe_file" 2>/dev/null; then
    log_fail "$rule: safe file still contains dangerous pattern"
  else
    log_pass "$rule: safe file is clean"
  fi
done

echo ""

# --- Semgrep Fixtures ---
echo "--- Semgrep Fixtures ---"
for fixture_dir in "$FIXTURES_DIR"/semgrep/*/; do
  rule=$(basename "$fixture_dir")

  vulnerable_file=$(ls "$fixture_dir"/vulnerable.{ts,tsx,js,jsx} 2>/dev/null | head -1)
  safe_file=$(ls "$fixture_dir"/safe.{ts,tsx,js,jsx} 2>/dev/null | head -1)

  if [ ! -f "$vulnerable_file" ]; then
    log_skip "$rule: no vulnerable file"
    continue
  fi

  if [ ! -f "$safe_file" ]; then
    log_skip "$rule: no safe file"
    continue
  fi

  log_pass "$rule: both files exist"
done

echo ""

# --- npm audit Fixtures ---
echo "--- npm audit Fixtures ---"
for fixture_dir in "$FIXTURES_DIR"/npm-audit/*/; do
  scenario=$(basename "$fixture_dir")

  if [ -f "$fixture_dir/package.json" ] && [ -f "$fixture_dir/package-lock.json" ]; then
    log_pass "$scenario: package.json and package-lock.json exist"
  else
    log_fail "$scenario: missing package.json or package-lock.json"
  fi
done

echo ""
echo "=== Results ==="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo -e "${YELLOW}Skipped: $SKIP${NC}"

if [ $FAIL -gt 0 ]; then
  echo ""
  echo -e "${RED}Some fixtures failed validation!${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}All fixtures validated successfully!${NC}"
