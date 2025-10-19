import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_EMAIL = Deno.env.get("CONTACT_NOTIFY_EMAIL") || "owner@example.com";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "no-reply@yourdomain.co.uk";

serve(async (req) => {
  try {
    const { booking } = await req.json();
    if (!RESEND_API_KEY) return new Response("Missing RESEND_API_KEY", { status: 400 });

    const subject = `New booking: ${booking?.full_name} — ${booking?.booking_reference || ''}`;
    const html = `<h2>New booking request</h2>
      <p><b>Name:</b> ${booking?.full_name}</p>
      <p><b>Email:</b> ${booking?.email}</p>
      <p><b>Idea:</b> ${booking?.tattoo_idea || '-'}</p>
      <p><b>Refs:</b> ${(booking?.reference_image_urls||[]).map((u:string)=>`<a href="${u}">${u}</a>`).join('<br/>')}</p>`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFY_EMAIL],
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
