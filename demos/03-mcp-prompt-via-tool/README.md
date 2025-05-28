# 03-mcp-prompt-via-tool

This demo shows how to expose an MCP prompt via a tool, allowing Cursor to use prompt templates even though it does not natively support MCP prompts.

## Background
- **MCP prompts** are reusable instruction templates that can be exposed by an MCP server (e.g., code review, translation prompts).
- **Cursor** currently only supports MCP tools. Prompts are not directly accessible or discoverable in the Cursor UI.
- **Workaround:** You can create a tool that returns a prompt's message structure, making it accessible to Cursor users.

## Structure
- `start/` — Skeleton code for the exercise.
- `final/` — Complete, working solution.

## How to run
1. `cd` into either `start/` or `final`.
2. Install dependencies: `npm install`
3. Run the inspector: `npx @modelcontextprotocol/inspector npx tsx server.ts`

## What this demonstrates
- How to define an MCP prompt.
- How to create a tool that returns a prompt's message structure.
- The workaround pattern for exposing prompts to Cursor.

## Note on Cursor Support
> Cursor currently only supports MCP tools. Prompts are not natively supported, but you can expose their functionality by wrapping them in a tool. This pattern allows you to leverage the full power of MCP even with current Cursor limitations. 