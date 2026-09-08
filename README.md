# Hovercode MCP server

Manage your [Hovercode](https://hovercode.com) QR codes, short links, landing pages, and forms from Claude, ChatGPT, Cursor, or any [Model Context Protocol](https://modelcontextprotocol.io) client — by chatting.

- **Endpoint:** `https://hovercode.com/mcp/` (Streamable HTTP, hosted — nothing to run)
- **Auth:** OAuth 2.1 (dynamic client registration + PKCE), or a Hovercode API token as a bearer token
- **Docs:** https://hovercode.com/integrations/mcp/ · https://hovercode.com/api/#mcp-server
- **This package:** a tiny stdio bridge (`npx hovercode-mcp`) for clients that can't connect to remote servers directly. It wraps [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) and points it at the hosted endpoint, so tools and behaviour are identical.

Anything the assistant creates lands in your Hovercode dashboard like any other code, and every create tool returns both a shareable link and the rendered QR image.

## Connect

### Claude, ChatGPT, and other connector clients (recommended)

Add a custom connector with the URL `https://hovercode.com/mcp/` and approve access. You log in to Hovercode as normal; there is no token to copy.

### Claude Code

```
claude mcp add --transport http hovercode https://hovercode.com/mcp/ \
  --header "Authorization: Bearer YOUR_API_TOKEN"
```

Your API token is on https://hovercode.com/api/.

### Cursor, Claude Desktop, VS Code, and other config-file clients

Remote (preferred):

```json
{
  "mcpServers": {
    "hovercode": {
      "type": "http",
      "url": "https://hovercode.com/mcp/",
      "headers": { "Authorization": "Bearer YOUR_API_TOKEN" }
    }
  }
}
```

Via this package (for clients that only support stdio servers):

```json
{
  "mcpServers": {
    "hovercode": {
      "command": "npx",
      "args": ["-y", "hovercode-mcp"]
    }
  }
}
```

With no token set, the bridge opens a browser for the Hovercode OAuth login the first time. To skip the browser, set `HOVERCODE_API_TOKEN`:

```json
{
  "mcpServers": {
    "hovercode": {
      "command": "npx",
      "args": ["-y", "hovercode-mcp"],
      "env": { "HOVERCODE_API_TOKEN": "YOUR_API_TOKEN" }
    }
  }
}
```

## What the assistant can do

| Area | Tools |
|------|-------|
| Workspaces | `list_workspaces`, `set_workspace` |
| QR codes | `create_qr_code`, `create_qr_codes_bulk`, `get_qr_code`, `list_qr_codes`, `update_qr_code` (retarget, restyle in place, rename), `delete_qr_code`, `download_qr` (print-ready PNG + SVG), `get_qr_activity`, `list_templates` |
| PDF codes | `create_pdf_qr` — host a PDF (URL or base64) behind a dynamic QR + short link; swap it later without reprinting |
| Analytics | `get_analytics` — totals, by-day trend, top countries/cities/OS/browsers for one code or a whole workspace |
| Short links | `create_short_link`, `get_short_link`, `list_short_links`, `update_short_link`, `delete_short_link`, `get_short_link_activity` |
| Landing pages | `build_page` (rich block-based page: header, links, text, image, button, video, gallery, FAQ, countdown, socials, form, …), `list_block_types`, `create_page` (simple link-in-bio), `get_page`, `list_pages`, `update_page`, `delete_page` |
| Forms | `create_form`, `update_form`, `list_forms`, `get_form`, `get_form_responses` |

## Things you can ask for

- "Create a dynamic QR code for https://example.com/summer in our brand colors with the caption SCAN ME."
- "Point my printed *menu* QR code at the new PDF at this link."
- "Restyle my event QR to rounded eyes and our navy — same code, don't replace it."
- "Make a landing page for our launch event with the schedule, a map link, and a sign-up form, and give me a QR for the posters."
- "Make QR codes for all 20 of these product URLs, all in the same style."
- "Make a form to collect name, email, and t-shirt size, and give me a link and QR to share it."
- "Summarize this week's responses to my feedback form."
- "How did my QR codes do this month, and where were people scanning them?"

## Plans and limits

The server is available on every Hovercode plan and respects the same limits as the dashboard and REST API. Static codes are unlimited; the free plan includes a small number of active dynamic (editable, tracked) codes and paid plans raise that limit.

## Discovery metadata

- Server card: `https://hovercode.com/.well-known/mcp/server-card.json`
- OAuth protected resource: `https://hovercode.com/.well-known/oauth-protected-resource/mcp`
- Connect guide as markdown: `https://hovercode.com/mcp/docs`
- `llms.txt`: `https://hovercode.com/llms.txt`

## Environment variables (bridge only)

| Variable | Purpose |
|----------|---------|
| `HOVERCODE_API_TOKEN` | Optional. Use your API token instead of the OAuth browser flow. |
| `HOVERCODE_MCP_URL` | Optional. Override the endpoint (default `https://hovercode.com/mcp/`). |

Extra CLI arguments are passed through to `mcp-remote`.

## Support

Questions or bugs: https://hovercode.com/contact/ or open an issue on this repo.

## License

MIT © Hovercode Ltd
