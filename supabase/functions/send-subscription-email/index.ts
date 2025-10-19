import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "no-reply@yourdomain.co.uk";

serve(async (req) => {
  try {
    const { email, full_name } = await req.json();
    if (!RESEND_API_KEY) return new Response("Missing RESEND_API_KEY", { status: 400 });

    const subject = `Welcome to the Beyond Ink list`;
    const html = `<h2>Welcome${full_name ? ', '+full_name : ''}!</h2><p>You’re on our list — expect flash days, drops, and offers.</p>`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject,
        html
      })
    });
    const data = await r.json();
    return new Response(JSON.stringify({ ok: true, data }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error: e.message }), { status: 500 });
  }
});
