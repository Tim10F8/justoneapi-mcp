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

Authentication is handled via JustOneAPI token.

Set environment variable:

    JUSTONEAPI_TOKEN=your_token_here

The token is passed as a query parameter and is never logged in plaintext.

---

## Installation

### Option 1: npx (Recommended)

Use directly with npx, no installation required:

Configure Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "justoneapi": {
      "command": "npx",
      "args": [
        "-y",
        "justoneapi-mcp"
      ],
      "env": {
        "JUSTONEAPI_BASE_URL": "https://api.justoneapi.com",
        "JUSTONEAPI_TOKEN": "your_token_here",
        "JUSTONEAPI_TIMEOUT_MS": "20000",
        "JUSTONEAPI_RETRY": "1",
        "JUSTONEAPI_DEBUG": "false"
      }
    }
  }
}
```

### Option 2: Global Installation

```bash
npm install -g justoneapi-mcp
```

Configure Claude Desktop:

```json
{
  "mcpServers": {
    "justoneapi": {
      "command": "justoneapi-mcp",
      "env": {
        "JUSTONEAPI_BASE_URL": "https://api.justoneapi.com",
        "JUSTONEAPI_TOKEN": "your_token_here",
        "JUSTONEAPI_TIMEOUT_MS": "20000",
        "JUSTONEAPI_RETRY": "1",
        "JUSTONEAPI_DEBUG": "false"
      }
    }
  }
}
```

### Option 3: Local Development

```bash
git clone <repository>
cd justoneapi-mcp
npm install
npm run build
```

Create `.env` file (optional, for local testing):

```env
JUSTONEAPI_TOKEN=your_token_here
JUSTONEAPI_DEBUG=true
```

Configure Claude Desktop:

```json
{
  "mcpServers": {
    "justoneapi": {
      "command": "node",
      "args": [
        "/absolute/path/to/justoneapi-mcp/dist/index.js"
      ],
      "env": {
        "JUSTONEAPI_BASE_URL": "https://api.justoneapi.com",
        "JUSTONEAPI_TOKEN": "your_token_here",
        "JUSTONEAPI_TIMEOUT_MS": "20000",
        "JUSTONEAPI_RETRY": "1",
        "JUSTONEAPI_DEBUG": "false"
      }
    }
  }
}
```

---

## Usage with Other MCP Hosts

This server follows the standard MCP protocol and is compatible with any MCP host (Cursor, Cline, custom agents, etc.).

Generic configuration:

```json
{
  "command": "npx",
  "args": ["-y", "justoneapi-mcp"],
  "env": {
    "JUSTONEAPI_TOKEN": "your_token_here"
  }
}
```

Or if globally installed:

```json
{
  "command": "justoneapi-mcp",
  "env": {
    "JUSTONEAPI_TOKEN": "your_token_here"
  }
}
```

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

Upstream errors are normalized into stable MCP error codes, including:

- INVALID_TOKEN
- RATE_LIMITED
- DAILY_QUOTA_EXCEEDED
- INSUFFICIENT_BALANCE
- VALIDATION_ERROR
- INTERNAL_ERROR

Each error includes an actionable message.

---

## Design Philosophy

Transport, not transformation.

This MCP prioritizes stability, transparency, and raw data fidelity over convenience.

---

## License

MIT
