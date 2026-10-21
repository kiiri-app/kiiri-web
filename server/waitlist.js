"use strict";
// Self-hosted twin of functions/api/waitlist.js: POST /api/waitlist { email, plan?, source? }.
// One JSON line per new email in $DATA_DIR/waitlist.jsonl. No dependencies.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 8080);
const FILE = path.join(process.env.DATA_DIR || "/data", "waitlist.jsonl");
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const MAX_BODY = 4096;

const seen = new Set();
try {
  for (const line of fs.readFileSync(FILE, "utf8").split("\n")) {
    if (line) try { seen.add(JSON.parse(line).email); } catch {}
  }
} catch {}

const json = (res, status, data) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  if (req.url === "/healthz") return json(res, 200, { ok: true });
  if (req.url !== "/api/waitlist") return json(res, 404, { ok: false, error: "not found" });
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "method not allowed" });
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > MAX_BODY) { json(res, 413, { ok: false, error: "too large" }); req.destroy(); }
  });
  req.on("end", () => {
    if (res.writableEnded) return;
    let body;
    try { body = JSON.parse(raw); } catch { return json(res, 400, { ok: false, error: "bad json" }); }
    const email = String(body.email || "").trim().toLowerCase();
    if (!EMAIL.test(email)) return json(res, 400, { ok: false, error: "invalid email" });
    if (!seen.has(email)) {
      const entry = {
        email,
        plan: ["plus", "pro"].includes(body.plan) ? body.plan : "plus",
        source: String(body.source || "").slice(0, 80),
        country: req.headers["cf-ipcountry"] || null,
        ts: new Date().toISOString(),
      };
      try {
        fs.mkdirSync(path.dirname(FILE), { recursive: true });
        fs.appendFileSync(FILE, JSON.stringify(entry) + "\n");
      } catch (err) {
        console.error("waitlist write failed:", err.message);
        return json(res, 500, { ok: false, error: "storage" });
      }
      seen.add(email);
    }
    json(res, 200, { ok: true });
  });
});

server.listen(PORT, () => console.log(`waitlist on :${PORT} → ${FILE}`));
