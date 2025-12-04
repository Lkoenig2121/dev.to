#!/bin/bash

echo "🔧 Fixing user data issue..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}This script will:${NC}"
echo "1. Kill any stuck processes"
echo "2. Ensure MongoDB is running"
echo "3. Seed the database with test users"
echo "4. Start the servers"
echo ""
read -p "Press Enter to continue..."

echo ""
echo -e "${YELLOW}Step 1: Killing stuck processes...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
echo -e "${GREEN}✓ Processes cleared${NC}"

echo ""
echo -e "${YELLOW}Step 2: Checking MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${RED}✗ MongoDB is not running${NC}"
    echo "Starting MongoDB..."
    mongod --fork --logpath /tmp/mongodb.log --dbpath ~/data/db 2>/dev/null || {
        echo -e "${RED}Failed to start MongoDB${NC}"
        echo "Please start MongoDB manually: mongod"
        exit 1
    }
    echo -e "${GREEN}✓ MongoDB started${NC}"
fi

echo ""
echo -e "${YELLOW}Step 3: Seeding database...${NC}"
npm run seed

echo ""
echo -e "${YELLOW}Step 4: Starting servers...${NC}"
echo "Starting in background..."
npm run dev:all &

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Open browser: http://localhost:3000"
echo "2. Press F12 to open console"
echo "3. Run: localStorage.clear()"
echo "4. Refresh page (F5)"
echo "5. Log in with:"
echo "   Email: john@example.com"
echo "   Password: password123"
echo ""
echo -e "${GREEN}Your profile will now work correctly!${NC}"

