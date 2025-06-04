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

## Step-by-Step Walkthrough: Building Your Own Prompt Server

### Step 1: Set up the Basic MCP Server

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-prompt-server",
  version: "1.0.0"
});
```

### Step 2: Create a Prompt Storage System

Create a `PromptLoader` class to manage your prompts:

```typescript
// prompts/loader.js
export class PromptLoader {
  constructor() {
    this.prompts = new Map();
  }

  async loadAllPrompts() {
    // Load your prompt files here
    // Can be from files, database, or hardcoded
  }

  getPromptByName(name) {
    return this.prompts.get(name);
  }

  getPromptsByCategory(category) {
    return Array.from(this.prompts.values())
      .filter(p => p.metadata.category === category);
  }

  listAllPrompts() {
    return Array.from(this.prompts.values());
  }
}
```

### Step 3: Add Discovery Tool

Create a tool that lists all available prompts:

```typescript
server.tool(
  "list-prompts", 
  {},
  async () => {
    const prompts = promptLoader.listAllPrompts();
    const summary = prompts.map(p => 
      `${p.metadata.name} (${p.metadata.category}): ${p.metadata.description} - Languages: ${p.metadata.languages.join(", ")}`
    ).join("\n");
    
    return {
      content: [{ type: "text", text: `Available prompts:\n${summary}` }]
    };
  }
);
```

### Step 4: Add Category-Based Retrieval

Allow users to get prompts by category and language:

```typescript
server.tool(
  "get-prompt-by-category",
  { 
    category: z.string(),
    language: z.string().default("javascript")
  },
  async ({ category, language }) => {
    const prompts = promptLoader.getPromptsByCategory(category)
      .filter(p => p.metadata.languages.includes(language.toLowerCase()));
    
    if (prompts.length === 0) {
      return {
        content: [{ type: "text", text: `No ${category} prompts found for ${language}. Use "list-prompts" to see what's available.` }]
      };
    }
    
    return {
      content: [{ type: "text", text: prompts[0].content }]
    };
  }
);
```

### Step 5: Add Direct Name Access

For power users who know exactly what they want:

```typescript
server.tool(
  "get-prompt",
  { name: z.string() },
  async ({ name }) => {
    const prompt = promptLoader.getPromptByName(name);
    return prompt ? 
      { content: [{ type: "text", text: prompt.content }] } :
      { content: [{ type: "text", text: `Prompt "${name}" not found. Use "list-prompts" to see available options.` }] };
  }
);
```

### Step 6: Connect and Start Server

```typescript
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Prompt Structure Best Practices

Structure your prompts with metadata for better discoverability:

```typescript
const prompt = {
  metadata: {
    name: "code-review-checks",
    category: "quality",
    description: "Comprehensive code review checklist",
    languages: ["javascript", "typescript", "python"],
    version: "1.0.0"
  },
  content: `You are tasked with performing a code review...`
};
```

## Integration with Cursor

Once your server is running, add it to your Cursor MCP configuration:

```json
{
  "mcpServers": {
    "my-prompt-server": {
      "command": "npx",
      "args": ["tsx", "/path/to/your/server.ts"]
    }
  }
}
```

## Usage Examples

1. **Discover available prompts:**
   - Use the `list-prompts` tool to see what's available

2. **Get a specific type of prompt:**
   - Use `get-prompt-by-category` with category="quality" and language="typescript"

3. **Get a specific prompt:**
   - Use `get-prompt` with name="code-review-checks"

## What this demonstrates
- How to structure reusable prompt templates in an MCP server
- How to create discovery and retrieval tools for prompts
- How to organize prompts by category and language
- The workaround pattern for exposing prompts to Cursor
- Best practices for prompt metadata and organization

## Note on Cursor Support
> Cursor currently only supports MCP tools. Prompts are not natively supported, but you can expose their functionality by wrapping them in tools. This pattern allows you to leverage the full power of MCP even with current Cursor limitations, enabling you to build powerful prompt libraries that enhance your development workflow. 