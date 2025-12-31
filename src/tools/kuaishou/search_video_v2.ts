import { z } from "zod";
import { requireToken } from "../../common/config.js";
import { getJson } from "../../common/http.js";

export const KuaishouSearchVideoV2Input = z.object({
  keyword: z.string().min(1).describe("Search keyword, e.g. 'dance'"),
  page: z.number().int().min(1).default(1).describe("Page number, default 1"),
});

export async function kuaishouSearchVideoV2(input: z.infer<typeof KuaishouSearchVideoV2Input>) {
  requireToken();

  const keyword = encodeURIComponent(input.keyword);
  const page = input.page ?? 1;

  // token 在 query 参数中
  const token = encodeURIComponent(process.env.JUSTONEAPI_TOKEN!);

  return getJson(
    `/api/kuaishou/search-video/v2?token=${token}&keyword=${keyword}&page=${page}`
  );
}