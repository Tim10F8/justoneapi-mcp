import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { mapError } from "./common/errors.js";
import {
  KuaishouSearchVideoV2Input,
  kuaishouSearchVideoV2,
} from "./tools/kuaishou/search_video_v2.js";

const server = new McpServer({
  name: "justoneapi-mcp",
  version: "1.0.0",
});

server.registerTool(
  "kuaishou_search_video_v2",
  {
    description: "Search Kuaishou videos by keyword.",
    inputSchema: {
      keyword: KuaishouSearchVideoV2Input.shape.keyword,
      page: KuaishouSearchVideoV2Input.shape.page,
    },
  },
  async (input) => {
    try {
      const data = await kuaishouSearchVideoV2(input as any);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    } catch (e: any) {
      const m = mapError(e);
      return {
        isError: true,
        content: [{ type: "text", text: `ERROR[${m.code}]: ${m.message}` }],
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