import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


// Create an MCP server
const server = new McpServer({
  name: "hello-mcp-server",
  version: "1.0.0"
});

// Tools are how you expose functionality to LLMs. They're similar to POST endpoints in a REST API - they perform
// computation and have side effects:
server.tool("add",                                     // Tool name
  "Add two numbers",                                   // Tool description
  { a: z.number(), b: z.number() },                    // Tool input schema
  async ({ a, b }) => ({                               // Tool implementation
    content: [{ type: "text", text: String(a + b) }]   // Tool output
  })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);