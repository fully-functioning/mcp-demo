import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

async function main() {
  try {
    const server = new McpServer({
      name: "resource-via-tool-server",
      version: "1.0.0"
    });

    // Define an MCP resource (e.g., config)
    server.resource(
      "config",
      new ResourceTemplate("config://app/settings", { list: undefined }),
      async (uri) => ({
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ theme: "dark", version: "1.2.3" })
        }]
      })
    );

    // Tool that fetches the resource and returns its data
    server.tool(
      "get-config",
      {},
      async () => {
        // Simulate fetching the resource
        const config = { theme: "dark", version: "1.2.3" };
        return {
          content: [{ type: "text", text: JSON.stringify(config) }]
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