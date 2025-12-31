import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { toMcpErrorPayload } from "./common/errors.js";
import {
  KuaishouSearchVideoV2Input,
  kuaishouSearchVideoV2,
} from "./tools/kuaishou/search_video_v2.js";

const server = new McpServer({
  name: "justoneapi-mcp",
  version: "0.1.0",
});

server.tool(
  "kuaishou_search_video_v2",
  "Search Kuaishou videos by keyword. Returns the original raw JSON response from upstream without field normalization.",
  KuaishouSearchVideoV2Input,
  async (input) => {
    try {
      const data = await kuaishouSearchVideoV2(input);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    } catch (e: any) {
      const m = toMcpErrorPayload(e);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `ERROR[${m.code}] (upstream=${m.upstreamCode ?? "N/A"}): ${m.message}`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});