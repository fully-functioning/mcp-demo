# 01-hello-mcp-server

This demo shows the simplest possible MCP server using Node.js/TypeScript.

## Folders

- `start/` — Minimal starting point (skeleton code, not fully working)
- `final/` — Fully working, completed example

## What it demonstrates
- How to set up an MCP server
- How to register a single tool (`add`) that adds two numbers

## Exercise #1

1. `cd` into `start/`.
1. Install dependencies:
   ```bash
   $ npm install
   ```
1. Let's add a tool to `server.ts' on line 14:
    ```javascript
    // Tools are how you expose functionality to LLMs. They're similar to endpoints in a REST API - they computation and have side effects:
    server.tool("add",
      { a: z.number(), b: z.number() },
      async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }]
      })
    );
    ```
1. Run Anthropic's MCP inspector with the following command:
   ```bash
   $ npx @modelcontextprotocol/inspector npx tsx server.ts      
   ```
1. Add the MCP Server to Cursor in your projects .cursor folder

    > [!CAUTION]
    > Spaces in filenames or paths may cause issues with Cursor

    [project_root]/.cursor/mcp.json
    ```json
    {
        "mcpServers": {
          "example-server": {
            "command": "/bin/bash",
          "args": [
            "/path/to/code/mcp_demo/demos/01-hello-mcp-server/start/launcher.sh"
          ]
          }
      }
    }
    ```

## Next steps
See the next demo for input validation, more tools, and error handling. 