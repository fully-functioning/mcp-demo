#!/bin/bash

# Change to the script directory
cd "$(dirname "$0")"
exec npx @modelcontextprotocol/inspector npx tsx server.ts  2>> ./debug-inspector.log