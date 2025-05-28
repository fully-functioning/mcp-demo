import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

async function main() {
  try {
    const server = new McpServer({
      name: "hello-mcp-server",
      version: "1.0.0"
    });

    
    // Tools are how you expose functionality to LLMs. They're similar to POST endpoints in a REST API - they perform
    // computation and have side effects:
    server.tool("add",
      { a: z.number(), b: z.number() },
      async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }]
      })
    );

    const transport = new StdioServerTransport();
    await server.connect(transport); 
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

main();