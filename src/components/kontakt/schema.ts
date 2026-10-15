import { z } from "zod";

export const teamSizes = ["1–10", "11–50", "51–250", "251+"] as const;
export const contactRoles = ["Obchod", "Administrativa", "Management", "Marketing", "IT", "Jiné"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Vyplňte jméno.").max(120),
  company: z.string().trim().min(2, "Vyplňte firmu.").max(160),
  email: z.email("Zadejte platný e-mail.").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  teamSize: z.enum(teamSizes, { error: "Vyberte velikost týmu." }),
  roles: z.array(z.enum(contactRoles)).max(contactRoles.length).default([]),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  context: z.string().trim().max(200).optional().or(z.literal("")),
  /** Honeypot – musí zůstat prázdné */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
