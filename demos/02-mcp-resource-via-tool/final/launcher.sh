#!/bin/bash

# Change to the script directory
cd "$(dirname "$0")"

# run the server
exec npx tsx server.ts 2>> ./debug.log