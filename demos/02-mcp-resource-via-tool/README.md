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

## Walkthrough

This walkthrough will guide you through building the MCP server from the skeleton code in the `start/` folder.

### Step 1: Set Up Your Environment

Navigate to the start directory and install dependencies:

```bash
cd start/
npm install
```

### Step 2: Create a Config File

Create a `config.json` file in the `start/` directory that will serve as our resource:

```json
{
  "theme": "dark",
  "version": "1.2.3",
  "featureFlag": true,
  "apiEndpoint": "https://api.example.com/v1"
}
```

This file represents the data that our MCP resource will expose.

### Step 3: Add Required Imports

Update your `server.ts` file to include the necessary imports for file system operations:

```typescript
import fs from "fs/promises";
import path from "path";
```

You'll need these to read the config file from disk.

### Step 4: Create a Config Loading Function

Add a function to load the config file:

```typescript
const configPath = path.join(process.cwd(), "config.json");

async function loadConfig() {
  try {
    const configRaw = await fs.readFile(configPath, "utf-8");
    return JSON.parse(configRaw);
  } catch (err) {
    return { error: "Could not load config: " + ((err as Error).message || err) };
  }
}
```

This function handles reading and parsing the JSON config file, with error handling.

### Step 5: Define an MCP Resource

Add a resource definition to your server. Place this after the server initialization but before the transport setup:

```typescript
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

// Inside your server setup:
server.resource(
  "config",
  new ResourceTemplate("config://app/settings", { list: undefined }),
  async (uri) => {
    const config = await loadConfig();
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(config)
      }]
    };
  }
);
```

This defines a resource with the URI `config://app/settings` that returns the config data.

### Step 6: Create a Tool to Expose the Resource

Add a tool that fetches and returns the resource data:

```typescript
server.tool(
  "get-config",
  {},
  async () => {
    const config = await loadConfig();
    return {
      content: [{ type: "text", text: JSON.stringify(config) }]
    };
  }
);
```

This tool allows Cursor users to access the resource data even though Cursor doesn't natively support MCP resources.

### Step 7: Wrap Everything in Error Handling

Wrap your main server setup in a try-catch block and create a main function:

```typescript
async function main() {
  try {
    // Your server setup code goes here
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

main();
```

### Step 8: Test Your Implementation

1. Run the MCP inspector to test your server:
   ```bash
   npx @modelcontextprotocol/inspector npx tsx server.ts
   ```

2. In the inspector:
   - Check the **Resources** tab to see your `config://app/settings` resource
   - Check the **Tools** tab to see your `get-config` tool
   - Try calling the `get-config` tool to retrieve the config data

### Expected Behavior

- **Resource**: You should see a resource listed as `config://app/settings`
- **Tool**: You should see a tool called `get-config` with no parameters
- **Tool execution**: Running `get-config` should return your config.json data as text

### Key Learning Points

1. **Resource Definition**: Resources in MCP are defined with a URI pattern and a handler function
2. **Tool Workaround**: Since Cursor only supports tools, you can create a tool that internally fetches resource data
3. **Error Handling**: Always include proper error handling for file operations and server setup
4. **URI Patterns**: Resources use URI patterns like `config://app/settings` to define their identity

This pattern allows you to leverage MCP resources in environments that only support tools, making your MCP servers more broadly compatible.

## Note on Cursor Support
> Cursor currently only supports MCP tools. Resources are not natively supported, but you can expose their functionality by wrapping them in a tool. This pattern allows you to leverage the full power of MCP even with current Cursor limitations. 