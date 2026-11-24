import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FaqList from "@/components/FaqList";
import WaLink from "@/components/WaLink";
import { TIcon, WaIcon } from "@/components/Icons";
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
  const others = TREATMENTS.filter((o) => o.slug !== x.slug).slice(0, 4);
  const crumbsLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
      { "@type": "ListItem", position: 2, name: x.t, item: `${SITE.url}/tratamientos/${x.slug}` },
    ],
  };
  const msg = `Hola Dra. Vanessa, quisiera información sobre: ${x.t}.`;

  return (
    <main className="vv">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(x.faq)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />

      <section className="hero-card-wrap">
        <div className="hero-card tp-card">
          <div className="hc-text">
            <div className="crumbs hero-in"><Link href="/">Inicio</Link> / <Link href="/#tratamientos">Tratamientos</Link></div>
            <span className="tp-ico hero-in" style={d(80)}><TIcon name={x.icon} /></span>
            <span className="tagline hero-in" style={d(120)}>{x.cat} · Cochabamba</span>
            <h1 className="hero-in" style={d(200)}>{x.t}</h1>
            <p className="hero-in" style={d(350)}>{x.intro}</p>
            <div className="tags hero-in" style={d(450)}>{x.tags.map((g) => <span key={g}>{g}</span>)}</div>
            <div className="hc-cta hero-in" style={d(550)}>
              <WaLink className="btn btn-rosa btn-lg" msg={msg} src="pagina-tratamiento" t={x.t}><WaIcon /> Consultar por WhatsApp</WaLink>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head"><h2 data-rv>¿Es para <em>usted</em>?</h2></div>
          <div className="who">{x.who.map((w, i) => <div key={w} data-rv style={d(i * 80)}><span>✓</span>{w}</div>)}</div>
        </div>
      </section>

      <section className="sec papas">
        <div className="wrap">
          <div className="sec-head center"><h2 data-rv>Cómo es <em>el proceso</em></h2></div>
          <ol className="ages steps4">
            {x.steps.map(([b, s], i) => (
              <li key={b} data-rv style={d(i * 120)}><span className="dot" /><b className="age">Paso {i + 1}</b><h3>{b}</h3><p>{s}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec faq-sec">
        <div className="wrap faq-wrap">
          <div className="faq-side" data-rv>
            <h2>Preguntas <em>frecuentes</em></h2>
            <p>Sobre {x.t.toLowerCase()}. Si tiene otra duda, escríbale a la doctora.</p>
            <WaLink className="btn btn-ciruela" msg={msg} src="pagina-tratamiento-faq" t={x.t}><WaIcon /> Consultar</WaLink>
          </div>
          <FaqList items={x.faq} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head"><h2 data-rv>Otros <em>tratamientos</em></h2></div>
          <div className="mini">
            {others.map((o, i) => (
              <Link key={o.slug} href={`/tratamientos/${o.slug}`} className="b-card t-crema" data-rv style={d(i * 80)}>
                <span className="b-ico"><TIcon name={o.icon} /></span><small>{o.cat}</small><h3>{o.t}</h3><span className="b-go">Ver <i>→</i></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
