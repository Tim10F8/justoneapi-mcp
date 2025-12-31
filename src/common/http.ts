import { config } from "./config.js";

export async function getJson(pathWithQuery: string) {
  // ⚠️ 不要打印完整 URL（避免 token 泄露到日志）
  const res = await fetch(`${config.baseUrl}${pathWithQuery}`, { method: "GET" });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const err: any = new Error(json?.message ?? `HTTP ${res.status}`);
    err.httpStatus = res.status;
    err.payload = json;
    err.code = json?.code ?? "UPSTREAM_ERROR";
    throw err;
  }
  return json;
}