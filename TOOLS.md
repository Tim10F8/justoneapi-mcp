# JustOneAPI MCP Tools Reference

Complete reference for all available tools in justoneapi-mcp.

> 💡 **Tip**: You can also discover tools dynamically in your MCP host by asking "list all available tools"

---

## Table of Contents

- [unified_search_v1](#unified_search_v1) - Unified multi-platform search
- [kuaishou_search_video_v2](#kuaishou_search_video_v2) - Kuaishou video search

---

## unified_search_v1

**Unified search across multiple Chinese social media and news platforms.**

Search data from Weibo, WeChat, Zhihu, Douyin, Xiaohongshu, Bilibili, Kuaishou, and News in one request.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `keyword` | string | Yes | Search keyword with advanced syntax |
| `source` | string | No | Platform filter (default: `ALL`) |
| `start` | string | First page only | Start time `yyyy-MM-dd HH:mm:ss` (UTC+8) |
| `end` | string | First page only | End time `yyyy-MM-dd HH:mm:ss` (UTC+8) |
| `nextCursor` | string | Pagination only | Cursor from previous response for next page |

### Search Syntax

- **Single keyword**: `deepseek`
- **AND search** (all keywords must match): `deepseek chatgpt`
- **OR search** (any keyword matches): `deepseek~chatgpt`
- **NOT search** (exclude keyword): `deepseek -chatgpt`

### Platform Options

| Value | Description |
|-------|-------------|
| `ALL` | All platforms (default) |
| `NEWS` | News sources |
| `WEIBO` | Sina Weibo (微博) |
| `WEIXIN` | WeChat (微信) |
| `ZHIHU` | Zhihu (知乎) |
| `DOUYIN` | Douyin/TikTok (抖音) |
| `XIAOHONGSHU` | Xiaohongshu/RedNote (小红书) |
| `BILIBILI` | Bilibili (哔哩哔哩) |
| `KUAISHOU` | Kuaishou (快手) |

### Time Range Rules

- `start` must be within **84 days** from now
- `end` must be after `start`
- Format: `yyyy-MM-dd HH:mm:ss` (UTC+8 timezone)

### Examples

#### First Page Search
```json
{
  "keyword": "AI",
  "source": "ALL",
  "start": "2025-01-01 00:00:00",
  "end": "2025-01-02 23:59:59"
}
```

#### Pagination (Next Page)
```json
{
  "keyword": "AI",
  "nextCursor": "6846442d123456782101ae3f"
}
```

#### Platform-Specific Search
```json
{
  "keyword": "deepseek chatgpt",
  "source": "WEIBO",
  "start": "2025-01-01 00:00:00",
  "end": "2025-01-02 23:59:59"
}
```

#### Complex Search Query
```json
{
  "keyword": "AI~机器学习 -广告",
  "source": "ZHIHU",
  "start": "2024-12-01 00:00:00",
  "end": "2025-01-02 23:59:59"
}
```

### Response

Returns raw JSON from upstream API including:
- Search results from selected platforms
- Metadata (code, message, recordTime)
- `nextCursor` for pagination (if more results available)

---

## kuaishou_search_video_v2

**Search Kuaishou (快手) videos by keyword.**

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keyword` | string | Yes | - | Search keyword |
| `page` | number | No | 1 | Page number (integer >= 1) |

### Examples

#### Basic Search
```json
{
  "keyword": "dance"
}
```

#### Paginated Search
```json
{
  "keyword": "dance",
  "page": 2
}
```

### Response

Returns raw JSON from upstream API including:
- Video search results
- Metadata (code, message, recordTime)
- Video details (title, author, URL, etc.)

---

## General Notes

### Output Format

All tools return raw JSON responses from upstream APIs. The typical structure is:

```json
{
  "code": 0,
  "message": null,
  "recordTime": "2025-01-02T12:00:00Z",
  "data": {
    // Platform-specific data structure
  }
}
```

- `code: 0` means success
- `code != 0` means error (see [Error Handling](README.md#error-handling))

### Error Handling

All tools use the same error handling mechanism. See the [Error Handling section](README.md#error-handling) in README.md for complete error code reference.

### Raw JSON Philosophy

This MCP returns **unmodified upstream responses** by design:
- ✅ Maximum data fidelity
- ✅ No field parsing or normalization
- ✅ No data restructuring
- ✅ Long-term compatibility

---

## Adding More Tools

As we add more tools, they will be documented here following the same format.

**Coming Soon:**
- Douyin video search
- Weibo post search
- Bilibili video search
- And more...

---

**Last Updated**: 2025-01-02
