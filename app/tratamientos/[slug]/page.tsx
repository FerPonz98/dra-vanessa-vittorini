import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FaqList from "@/components/FaqList";
import Split from "@/components/Split";
import WaLink from "@/components/WaLink";
import { WaIcon } from "@/components/Icons";
import { SITE, TREATMENTS, faqJsonLd } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const x = TREATMENTS.find((t) => t.slug === slug);
  if (!x) return {};
  const description = `${x.intro.split(". ")[0]}. ${x.seo} con la Dra. Vanessa Vittorini Sangueza.`;
  return {
    title: x.seo,
    description,
    alternates: { canonical: `/tratamientos/${x.slug}` },
    openGraph: { title: `${x.seo} · Dra. Vanessa Vittorini`, description, images: ["/og-image.jpg"] },
  };
}

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const x = TREATMENTS.find((t) => t.slug === slug);
  if (!x) notFound();
  const others = TREATMENTS.filter((o) => o.slug !== x.slug).slice(0, 6);
  const crumbsLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
      { "@type": "ListItem", position: 2, name: x.t, item: `${SITE.url}/tratamientos/${x.slug}` },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(x.faq)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
      <section className="tp-hero">
        <div className="wrap">
          <div className="crumbs hero-in"><Link href="/">Inicio</Link> / <Link href="/#tratamientos">Tratamientos</Link> / {x.t}</div>
          <div className="tp-grid">
            <div className="blocks">
              <div>
                <span className="kicker hero-in" style={d(100)}>{x.cat} · Cochabamba</span>
                <h1><Split text={x.t} base={150} /></h1>
                <p className="lead hero-in" style={d(450)}>{x.intro}</p>
                <div className="chips hero-in" style={d(600)}>{x.tags.map((g) => <span key={g}>{g}</span>)}</div>
              </div>
              <div>
                <h2 data-rv>¿Es para <span className="it">ti</span>?</h2>
                <div className="forwho">{x.who.map((w, i) => <div key={w} data-rv style={d(i * 80)}>{w}</div>)}</div>
              </div>
              <div>
                <h2 data-rv>Cómo es el <span className="it">proceso</span></h2>
                <div className="proc">{x.steps.map(([b, s], i) => <div key={b} data-rv="left" style={d(i * 90)}><span className="n">0{i + 1}</span><span><b>{b}</b><span>{s}</span></span></div>)}</div>
              </div>
              <div>
                <h2 data-rv>Preguntas <span className="it">frecuentes</span></h2>
                <FaqList items={x.faq} />
              </div>
              <div>
                <h2 data-rv>Otros <span className="it">tratamientos</span></h2>
                <div className="related">{others.map((o, i) => <Link key={o.slug} href={`/tratamientos/${o.slug}`} data-rv style={d(i * 60)}>{o.t}<span>→</span></Link>)}</div>
              </div>
            </div>
            <aside className="side-card hero-in" style={d(500)}>
              <h3>Consulta por {x.t.toLowerCase()}</h3>
              <p>Escríbale a la doctora con el mensaje ya listo. Le responde y coordinan su valoración.</p>
              <WaLink className="btn btn-wa" msg={`Hola Dra. Vanessa, quisiera información sobre: ${x.t}.`} src="pagina-tratamiento" t={x.t}><WaIcon /> Consultar por WhatsApp</WaLink>
              <ul><li>Valoración personalizada</li><li>Plan y presupuesto claros</li><li>Formación en 4 países</li></ul>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
