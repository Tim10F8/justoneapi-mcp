export const config = {
  baseUrl: process.env.JUSTONEAPI_BASE_URL ?? "http://47.117.133.51:30015",
  token: process.env.JUSTONEAPI_TOKEN ?? "", // 你的 token 目前放 query 参数里
};

export function requireToken() {
  if (!config.token) {
    const err: any = new Error("Missing JUSTONEAPI_TOKEN. Please set it in MCP server env.");
    err.code = "INVALID_API_KEY";
    throw err;
  }
}