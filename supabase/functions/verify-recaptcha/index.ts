// Deno (Supabase Edge Functions)
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RECAPTCHA_SECRET = Deno.env.get("RECAPTCHA_SECRET");

serve(async (req) => {
  try {
    const { token } = await req.json();
    if (!token || !RECAPTCHA_SECRET) {
      return new Response(JSON.stringify({ success: false, error: "Missing token or secret" }), { status: 400 });
    }
    const form = new URLSearchParams();
    form.append("secret", RECAPTCHA_SECRET);
    form.append("response", token);
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: form,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
  }
});
