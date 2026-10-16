import type { Metadata } from "next";
import { ReadinessQuiz } from "@/components/kviz/readiness-quiz";
import { questions } from "@/components/kviz/questions";
import { PageHero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Test: Jak je vaše firma připravená na AI?",
  description:
    "Devět otázek, dvě minuty. Zjistěte stupeň AI připravenosti vaší firmy a jaký formát školení vám dá největší posun.",
  alternates: { canonical: "/kviz" },
};

export default function KvizPage() {
  return (
    <>
      <PageHero
        label="Test připravenosti"
        title={
          <>
            Jak jste <span className="hl">připravení?</span>
          </>
        }
        lead="Devět otázek o strategii, nástrojích, datech a lidech. Na konci dostanete report se stupněm připravenosti a doporučeným dalším krokem."
        meta={[
          ["Otázky", String(questions.length)],
          ["Čas", "cca 2 min"],
          ["Oblasti", "4"],
          ["Data", "Neukládáme"],
        ]}
      />
      <Section className="pt-8! lg:pt-12!">
        <ReadinessQuiz />
      </Section>
    </>
  );
}
