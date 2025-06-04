import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const configPath = path.join(process.cwd(), "config.json");

async function loadConfig() {
  try {
    const configRaw = await fs.readFile(configPath, "utf-8");
    return JSON.parse(configRaw);
  } catch (err) {
    return { error: "Could not load config: " + ((err as Error).message || err) };
  }
}

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

    // Tool that fetches the resource and returns its data
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

    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

main(); 