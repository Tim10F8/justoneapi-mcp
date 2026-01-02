import { z } from "zod";
import { requireToken } from "../../common/config.js";
import { getJson } from "../../common/http.js";

// Platform type enum matching CiviwPlatformType
export const PlatformType = z.enum([
  "ALL",
  "NEWS",
  "WEIBO",
  "WEIXIN",
  "ZHIHU",
  "DOUYIN",
  "XIAOHONGSHU",
  "BILIBILI",
  "KUAISHOU",
]);

export const UnifiedSearchV1Input = z.object({
  keyword: z
    .string()
    .min(1)
    .describe(
      "Search keyword. Syntax: single keyword 'word', AND 'word1 word2', OR 'word1~word2', NOT 'word -excluded'"
    ),
  source: PlatformType.optional().describe(
    "Platform source: ALL (default), NEWS, WEIBO, WEIXIN, ZHIHU, DOUYIN, XIAOHONGSHU, BILIBILI, KUAISHOU"
  ),
  start: z
    .string()
    .optional()
    .describe(
      "Start time in format 'yyyy-MM-dd HH:mm:ss' (UTC+8). Required for first page, must be within 84 days"
    ),
  end: z
    .string()
    .optional()
    .describe(
      "End time in format 'yyyy-MM-dd HH:mm:ss' (UTC+8). Required for first page, must be after start time"
    ),
  nextCursor: z
    .string()
    .optional()
    .describe(
      "Pagination cursor from previous response. Use this for subsequent pages instead of start/end times"
    ),
});

export async function unifiedSearchV1(input: z.infer<typeof UnifiedSearchV1Input>) {
  const token = encodeURIComponent(requireToken());
  const keyword = encodeURIComponent(input.keyword);

  // Build query parameters
  const params = new URLSearchParams();
  params.append("token", token);
  params.append("keyword", keyword);

  if (input.source) {
    params.append("source", input.source);
  }

  if (input.nextCursor) {
    // Pagination: use nextCursor
    params.append("nextCursor", input.nextCursor);
  } else {
    // First page: require start and end times
    if (!input.start || !input.end) {
      throw new Error(
        "start and end times are required for the first page (unless using nextCursor for pagination)"
      );
    }
    params.append("start", input.start);
    params.append("end", input.end);
  }

  return await getJson(`/api/search/v1?${params.toString()}`);
}
