import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { object, z } from "zod";
import { PromptLoader } from "./prompts/loader.js";

async function main() {
  try {
    const server = new McpServer({
      name: "prompt-via-tool-server",
      version: "1.0.0"
    });

    // Initialize prompt loader
    const promptLoader = new PromptLoader();
    await promptLoader.loadAllPrompts();

    // 1. Discovery - shows everything available
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

    // 2. Get prompt by category and language
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

    // 3. Direct access by name (for power users)
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

    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

main(); 