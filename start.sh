#!/bin/bash

# LexAI Quick Start Script
echo ""
echo "⚖️  LexAI — AI Legal Document Agent"
echo "======================================"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org"
  exit 1
fi

echo "✅ Node.js $(node --version) found"
echo ""

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "⚠️  Created backend/.env — please add your ANTHROPIC_API_KEY"
fi
npm install --silent
echo "✅ Backend ready"

# Frontend setup
echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
fi
npm install --silent
echo "✅ Frontend ready"

echo ""
echo "🚀 Starting servers..."
echo ""
echo "   Backend  → http://localhost:3001"
echo "   Frontend → http://localhost:3000"
echo ""
echo "⚠️  Make sure ANTHROPIC_API_KEY is set in backend/.env"
echo ""

# Start both in background
cd ../backend && npm run dev &
cd ../frontend && npm run dev &

wait
