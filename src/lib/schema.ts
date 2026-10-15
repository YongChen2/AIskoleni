import { brand } from "@/config/brand";
import { faq, formats } from "@/content/site";

const base = brand.url.replace(/\/$/, "");
const orgId = `${base}/#organization`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": orgId,
  name: brand.name,
  url: base,
  logo: `${base}/icon.svg`,
  description: brand.description,
  email: brand.contact.email,
  telephone: brand.contact.phone,
  // [DOPLNIT] adresu, IČO a sameAs (LinkedIn apod.) až budou údaje známé
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Firemní školení AI podle rolí",
  serviceType: "Firemní školení umělé inteligence",
  provider: { "@id": orgId },
  areaServed: { "@type": "Country", name: "Česko" },
  availableLanguage: "cs",
  description: brand.description,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Formáty školení",
    itemListElement: formats.map((f) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: f.title, description: f.short },
    })),
  },
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a.replace(/\s*\[DOPLNIT[^\]]*\]/g, "") },
  })),
};

export const coursesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: formats.map((f, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Course",
      "@id": `${base}/skoleni#${f.slug}`,
      url: `${base}/skoleni#${f.slug}`,
      name: f.title,
      description: f.short,
      inLanguage: "cs",
      provider: { "@id": orgId, "@type": "Organization", name: brand.name },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: ["Onsite", "Online"],
        courseWorkload: f.duration,
      },
    },
  })),
};
