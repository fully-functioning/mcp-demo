# 02-mcp-resource-via-tool

This demo shows how to expose an MCP resource via a tool, allowing Cursor to access resource data even though it does not natively support MCP resources.

## Background
- **MCP resources** are data sources that can be exposed by an MCP server (e.g., config, metadata, static data).
- **Cursor** currently only supports MCP tools. Resources are not directly accessible or discoverable in the Cursor UI.
- **Workaround:** You can create a tool that fetches a resource internally and returns its data, making it accessible to Cursor users.

## Structure
- `start/` — Skeleton code for the exercise.
- `final/` — Complete, working solution.

## How to run
1. `cd` into either `start/` or `final`.
2. Install dependencies: `npm install`
3. Run the inspector: `npx @modelcontextprotocol/inspector npx tsx server.ts`

## What this demonstrates
- How to define an MCP resource.
- How to create a tool that fetches and returns resource data.
- The workaround pattern for exposing resources to Cursor.

## Note on Cursor Support
> Cursor currently only supports MCP tools. Resources are not natively supported, but you can expose their functionality by wrapping them in a tool. This pattern allows you to leverage the full power of MCP even with current Cursor limitations. 