// Cloudflare Pages Function: POST /api/waitlist  { email, plan?, source? }
// Stores one KV entry per email. Bind a KV namespace as WAITLIST in the Pages project.
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

export async function onRequestPost({ request, env }) {
  if (!env.WAITLIST) return json({ ok: false, error: "waitlist not configured" }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }
  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL.test(email)) return json({ ok: false, error: "invalid email" }, 400);
  const plan = ["plus", "pro"].includes(body.plan) ? body.plan : "plus";
  const key = `email:${email}`;
  if (!(await env.WAITLIST.get(key))) {
    await env.WAITLIST.put(key, JSON.stringify({
      email, plan,
      source: String(body.source || "").slice(0, 80),
      country: request.cf?.country || null,
      ts: new Date().toISOString(),
    }));
  }
  return json({ ok: true });
}

export const onRequest = () => json({ ok: false, error: "method not allowed" }, 405);

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
