#!/usr/bin/env bash
set -e
npm install
cp -n .env.example .env || true
npm run dev
