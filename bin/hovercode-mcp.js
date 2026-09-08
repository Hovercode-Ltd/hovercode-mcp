#!/usr/bin/env node
/**
 * hovercode-mcp — stdio bridge to the hosted Hovercode MCP server.
 *
 * The real server lives at https://hovercode.com/mcp/ (Streamable HTTP, OAuth).
 * This package exists for clients that only speak stdio, and for one-line
 * installs: `npx hovercode-mcp`. It simply runs mcp-remote against the hosted
 * endpoint, so tools, auth, and behaviour are identical to connecting directly.
 *
 * Auth:
 *   - Default: OAuth. mcp-remote opens a browser for the Hovercode login/consent.
 *   - Optional: set HOVERCODE_API_TOKEN to use your API token instead (no browser).
 *
 * Any extra CLI args are passed straight through to mcp-remote.
 */
"use strict";

const { spawn } = require("node:child_process");
const path = require("node:path");

const url = process.env.HOVERCODE_MCP_URL || "https://hovercode.com/mcp/";

const args = [url, "--transport", "http-only"];
if (process.env.HOVERCODE_API_TOKEN) {
  args.push("--header", `Authorization: Bearer ${process.env.HOVERCODE_API_TOKEN}`);
}
args.push(...process.argv.slice(2));

const pkg = require("mcp-remote/package.json");
const proxy = path.join(path.dirname(require.resolve("mcp-remote/package.json")), pkg.bin["mcp-remote"]);

const child = spawn(process.execPath, [proxy, ...args], { stdio: "inherit" });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => child.kill(sig));
}
