import { Resend } from "resend";
import { z } from "zod";
import { contactSchema } from "@/components/kontakt/schema";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  // Honeypot: bot vyplnil skryté pole → tváříme se, že je vše v pořádku
  if (body && typeof body === "object" && "website" in body && (body as { website?: string }).website) {
    return Response.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Zkontrolujte prosím formulář.", fields: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    );
  }

  const rl = await rateLimit(`kontakt:${clientIp(req)}`, 10);
  if (!rl.ok) {
    return Response.json({ error: "Příliš mnoho odeslání. Napište nám prosím e-mailem." }, { status: 429 });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error("Kontaktní formulář: chybí RESEND_API_KEY, CONTACT_TO_EMAIL nebo CONTACT_FROM_EMAIL");
    return Response.json(
      { error: "Formulář zatím není propojený s e-mailem. Napište nám prosím přímo." },
      { status: 503 }
    );
  }

  const d = parsed.data;
  const text = [
    `Jméno: ${d.name}`,
    `Firma: ${d.company}`,
    `E-mail: ${d.email}`,
    `Telefon: ${d.phone || "—"}`,
    `Velikost týmu: ${d.teamSize}`,
    `Role: ${d.roles.length ? d.roles.join(", ") : "—"}`,
    d.context ? `Kontext: ${d.context}` : null,
    "",
    "Zpráva:",
    d.message || "—",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL.split(",").map((s) => s.trim()),
    replyTo: d.email,
    subject: `Poptávka školení – ${d.company} (${d.teamSize})`,
    text,
  });

  if (error) {
    console.error("Resend error", error);
    return Response.json({ error: "Odeslání se nepovedlo. Zkuste to prosím znovu nebo nám napište." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
