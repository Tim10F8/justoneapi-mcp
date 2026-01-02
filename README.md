[![npm version](https://badge.fury.io/js/justoneapi-mcp.svg)](https://www.npmjs.com/package/justoneapi-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
> **Raw JSON by design.** Unmodified upstream responses for maximum data fidelity.

# JustOneAPI MCP Server

Use JustOneAPI inside AI assistants via Model Context Protocol (MCP).

This MCP server is a thin transport layer that exposes JustOneAPI endpoints to AI agents and returns the original raw JSON response from upstream platforms.

---

## What This MCP Does

- Exposes JustOneAPI endpoints as MCP tools
- Handles authentication, retries, timeouts, and error normalization
- Returns raw upstream JSON without field parsing
- Designed for AI agents and developer workflows

---

## What This MCP Does NOT Do

- No field parsing or schema normalization
- No data restructuring
- No assumptions about upstream response structure

This design is intentional to preserve data fidelity and long-term compatibility.

---

## Available Tools

### kuaishou_search_video_v2

Search Kuaishou videos by keyword.

Input:
- keyword (string, required)
- page (number, optional, default: 1)

Output:
- Returns the original raw JSON response from upstream
- Includes metadata such as code, message, recordTime

---

## Output Contract

This MCP returns raw JSON from upstream APIs.

Example (simplified):

    {
      "code": 0,
      "message": null,
      "recordTime": "2025-12-31T14:55:21Z",
      "data": ...
    }

---

## Authentication

You need a JustOneAPI token to use this server.

**Get your token**: Visit [https://justoneapi.com](https://justoneapi.com) to sign up and obtain your API token.

---

## Installation

### Option 1: npx (Recommended)

Use directly with npx, no installation required.

**Configure Claude Desktop:**

Edit the configuration file for your operating system:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "justoneapi": {
      "command": "npx",
      "args": ["-y", "justoneapi-mcp"],
      "env": {
        "JUSTONEAPI_TOKEN": "your_actual_token_here"
      }
    }
  }
}
```

> 💡 **Get your token**: Sign up at [justoneapi.com](https://justoneapi.com)

### Option 2: Global Installation

```bash
npm install -g justoneapi-mcp
```

**Configure Claude Desktop:**

Edit the configuration file for your operating system:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "justoneapi": {
      "command": "justoneapi-mcp",
      "env": {
        "JUSTONEAPI_TOKEN": "your_actual_token_here"
      }
    }
  }
}
```

> 💡 **Get your token**: Sign up at [justoneapi.com](https://justoneapi.com)

### Option 3: Local Development

```bash
git clone <repository>
cd justoneapi-mcp
npm install
npm run build
```

**Configure Claude Desktop:**

Edit the configuration file for your operating system:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "justoneapi": {
      "command": "node",
      "args": ["/absolute/path/to/justoneapi-mcp/dist/index.js"],
      "env": {
        "JUSTONEAPI_TOKEN": "your_actual_token_here"
      }
    }
  }
}
```

> 💡 **Get your token**: Sign up at [justoneapi.com](https://justoneapi.com)

That's it! Only the token is required.

---

## Usage with Other MCP Hosts

This server follows the standard MCP protocol and is compatible with any MCP host (Cursor, Cline, custom agents, etc.).

Generic configuration:

```json
{
  "command": "npx",
  "args": ["-y", "justoneapi-mcp"],
  "env": {
    "JUSTONEAPI_TOKEN": "your_actual_token_here"
  }
}
```

Or if globally installed:

```json
{
  "command": "justoneapi-mcp",
  "env": {
    "JUSTONEAPI_TOKEN": "your_actual_token_here"
  }
}
```

> 💡 **Get your token**: Sign up at [justoneapi.com](https://justoneapi.com)

---

## Quick Start

### 1) Restart Your MCP Host

After configuring, restart Claude Desktop (Cmd + Q) or your MCP host.

### 2) Test

In Claude Desktop:

    Please list available tools.

Then:

    Use the tool kuaishou_search_video_v2 to search videos with keyword "dance".
    Return the raw JSON.

---

## Error Handling

All errors are normalized into stable MCP error codes with actionable messages.

### Error Codes

| Error Code | Description | Action                              |
|------------|-------------|-------------------------------------|
| `INVALID_TOKEN` | Token is invalid or inactive | Update your `JUSTONEAPI_TOKEN`      |
| `COLLECT_FAILED` | Data collection failed | Retry after a short delay           |
| `RATE_LIMITED` | Too many requests | Slow down and retry later           |
| `DAILY_QUOTA_EXCEEDED` | Daily usage limit reached | Wait until tomorrow or upgrade plan |
| `INSUFFICIENT_BALANCE` | Account balance too low | Top up your account                 |
| `PERMISSION_DENIED` | No access to this resource | Contact support                     |
| `VALIDATION_ERROR` | Invalid request parameters | Check input values                  |
| `INTERNAL_ERROR` | Server error | Retry later                         |
| `NETWORK_TIMEOUT` | Request timed out | Check network or retry              |
| `NETWORK_ERROR` | Network connection failed | Check internet connection           |
| `UPSTREAM_ERROR` | Unspecified upstream error | Retry or contact support            |

### Error Format

Errors are returned in this format:
```
ERROR[ERROR_CODE] (upstream=XXX): Human-readable message
```

Example:
```
ERROR[RATE_LIMITED] (upstream=302): Rate limit exceeded. Please slow down and retry later.
```

---

## Design Philosophy

Transport, not transformation.

This MCP prioritizes stability, transparency, and raw data fidelity over convenience.

---

## Advanced Configuration (Optional)

By default, the server works with sensible defaults. You only need to set `JUSTONEAPI_TOKEN`.

However, you can customize behavior with these optional environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `JUSTONEAPI_TOKEN` | *(required)* | Your JustOneAPI token |
| `JUSTONEAPI_BASE_URL` | `https://api.justoneapi.com` | API endpoint |
| `JUSTONEAPI_TIMEOUT_MS` | `20000` | Request timeout (milliseconds) |
| `JUSTONEAPI_RETRY` | `1` | Number of retries after first attempt |
| `JUSTONEAPI_DEBUG` | `false` | Enable debug logging to stderr |

Example with custom settings:

```json
{
  "mcpServers": {
    "justoneapi": {
      "command": "npx",
      "args": ["-y", "justoneapi-mcp"],
      "env": {
        "JUSTONEAPI_TOKEN": "your_token_here",
        "JUSTONEAPI_TIMEOUT_MS": "30000",
        "JUSTONEAPI_DEBUG": "true"
      }
    }
  }
}
```

---

## License

MIT
