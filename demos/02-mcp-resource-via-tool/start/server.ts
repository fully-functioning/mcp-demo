// Skeleton for Hello MCP Server
// TODO: Import and set up MCP server here
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Set up the MCP server
const server = new McpServer({
    name: "get-resources",
    version: "1.0.0"
  });
  
// ...  add your tools here ...



// Start the server 
const transport = new StdioServerTransport();
await server.connect(transport);