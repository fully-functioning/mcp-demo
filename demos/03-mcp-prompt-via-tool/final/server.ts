import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

async function main() {
  try {
    const server = new McpServer({
      name: "prompt-via-tool-server",
      version: "1.0.0"
    });

    // Define an MCP prompt (e.g., review-code)
    server.prompt(
      "review-code",
      { code: z.string() },
      ({ code }) => ({
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: `Please review this code:\n\n${code}`
          }
        }]
      })
    );

    // Tool that returns the prompt's message structure
    server.tool(
      "review-code-tool",
      { code: z.string() },
      async ({ code }) => {
        return {
          content: [{
            type: "text",
            text: `Please review this code:\n\n${code}`
          }]
        };
      }
    );

    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

main(); 