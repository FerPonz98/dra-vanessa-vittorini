import Image from "next/image";
import Link from "next/link";
import BeforeAfter from "@/components/BeforeAfter";
import FaqList from "@/components/FaqList";
import WaLink from "@/components/WaLink";
import Flag from "@/components/Flag";
import { TIcon, WaIcon } from "@/components/Icons";
import { FORMACION, GENERAL_FAQ, SITE, TREATMENTS, faqJsonLd } from "@/lib/data";

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

// Guía por edades para papás (orientativa; cada caso se evalúa en consulta).
const EDADES = [
  ["1 año", "Primera visita", "Con los primeros dientes: revisión y hábitos de higiene."],
  ["3 – 5", "Hábitos", "Chupón, dedo o respirar por la boca pueden afectar el crecimiento."],
  ["6 – 7", "Primera consulta de ortodoncia", "El mejor momento para detectar problemas de mordida a tiempo."],
  ["8 – 12", "Ortopedia maxilar", "Se aprovecha el crecimiento para guiar los maxilares."],
  ["12 +", "Brackets", "Con los dientes permanentes, se alinean y se corrige la mordida."],
] as const;

const TINTS = ["t-rosa", "t-lila", "t-crema", "t-rosa", "t-crema", "t-lila", "t-rosa", "t-lila"];

export default function Home() {
  const [first, ...rest] = TREATMENTS;
  return (
    <main className="vv">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(GENERAL_FAQ)) }} />

      {/* HERO: tarjeta grande ciruela */}
      <section className="hero-card-wrap">
        <div className="hero-card">
          <div className="hc-text">
            <span className="tagline hero-in" style={d(0)}>Ortodoncia · Ortopedia maxilar · Cochabamba</span>
            <h1 className="hero-in" style={d(150)}>Sonrisas que <em>crecen</em><br />sanas y alineadas.</h1>
            <p className="hero-in" style={d(350)}>Para niños, jóvenes y adultos. Un plan claro desde la primera cita, en Torres Sofer, piso 6.</p>
            <div className="hc-cta hero-in" style={d(500)}>
              <WaLink className="btn btn-rosa btn-lg" msg="Hola Dra. Vanessa, quisiera agendar una valoración." src="hero"><WaIcon /> Agendar valoración</WaLink>
              <Link className="btn btn-line" href="#papas">Guía para papás</Link>
            </div>
          </div>
          <div className="hc-photo">
            <div className="orb" />
            <Image src="/img/dra-vanessa.png" alt="Dra. Vanessa Vittorini Sangueza, ortodoncista en Cochabamba" width={512} height={512} priority />
            <span className="sticker s1">🦷 Brackets</span>
            <span className="sticker s2">✨ Niños y adultos</span>
          </div>
          <div className="hc-stats hero-in" style={d(700)}>
            <a className="st-paises" href="#formacion" aria-label="4 países de formación: ver formación">
              <b data-count="4">4</b><span>países de formación</span>
              <span className="flags">{FORMACION.map((f) => <Flag key={f.pais} pais={f.pais} />)}</span>
            </a>
            <div><b data-count="8">8</b><span>tratamientos</span></div>
            <div><b>6–7</b><span>años: primera consulta</span></div>
          </div>
        </div>
      </section>

      {/* TRATAMIENTOS: bento */}
      <section id="tratamientos" className="sec">
        <div className="wrap">
          <div className="sec-head">
            <h2 data-rv>Tratamientos <em>para cada etapa</em></h2>
            <p data-rv style={d(100)}>Toque uno para ver de qué se trata, cómo es el proceso y escribir a la doctora.</p>
          </div>
          <div className="bento">
            <Link href={`/tratamientos/${first.slug}`} className="b-card b-big t-ciruela" data-rv="scale">
              <span className="b-ico"><TIcon name={first.icon} /></span>
              <small>{first.cat}</small>
              <h3>{first.t}</h3>
              <p>{first.intro}</p>
              <span className="b-go">Ver tratamiento <i>→</i></span>
            </Link>
            {rest.map((t, i) => (
              <Link href={`/tratamientos/${t.slug}`} className={`b-card ${TINTS[i]}`} key={t.slug} data-rv style={d((i % 3) * 90)}>
                <span className="b-ico"><TIcon name={t.icon} /></span>
                <small>{t.cat}</small>
                <h3>{t.t}</h3>
                <p>{t.short}</p>
                <span className="b-go">Ver <i>→</i></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PARA PAPÁS: línea de tiempo por edades */}
      <section id="papas" className="sec papas">
        <div className="wrap">
          <div className="sec-head center">
            <span className="chip-soft" data-rv>Guía para papás</span>
            <h2 data-rv style={d(80)}>¿Cuándo llevar a su hijo <em>a la ortodoncista?</em></h2>
            <p data-rv style={d(160)}>Una referencia simple por edades. Cada niño es distinto: en la valoración se define el mejor momento.</p>
          </div>
          <ol className="ages">
            {EDADES.map(([edad, t, p], i) => (
              <li key={edad} data-rv style={d(i * 120)}>
                <span className="dot" />
                <b className="age">{edad}</b>
                <h3>{t}</h3>
                <p>{p}</p>
              </li>
            ))}
          </ol>
          <div className="center" data-rv>
            <WaLink className="btn btn-ciruela btn-lg" msg="Hola Dra. Vanessa, quisiera una valoración para mi hijo/a." src="papas">Agendar valoración para mi hijo</WaLink>
          </div>
        </div>
      </section>

      {/* CASOS */}
      <section id="casos" className="sec">
        <div className="wrap">
          <div className="sec-head">
            <h2 data-rv>Casos <em>reales</em></h2>
            <p data-rv style={d(100)}>Deslice para comparar. Publicados con autorización de cada paciente.</p>
          </div>
          <div className="ba-grid">
            {/* Reemplazar con fotos reales: <BeforeAfter title="..." before="/casos/1-antes.jpg" after="/casos/1-despues.jpg" /> */}
            <BeforeAfter title="Ortodoncia con brackets" />
            <BeforeAfter title="Ortopedia maxilar" d={120} />
            <BeforeAfter title="Apiñamiento" d={240} />
          </div>
          <p className="note">Espacio reservado para las fotos de antes y después del consultorio.</p>
        </div>
      </section>

      {/* FORMACIÓN: recorrido */}
      <section id="formacion" className="sec formacion">
        <div className="wrap">
          <div className="sec-head">
            <h2 data-rv>Un recorrido por <em>cuatro países</em></h2>
            <p data-rv style={d(100)}>Ciencia, odontología y especialización en ortodoncia: una formación pensada para cada etapa de la sonrisa.</p>
          </div>
          <div className="route">
            {FORMACION.map((f, i) => (
              <div className="stop" key={f.lugar} data-rv style={d(i * 130)}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <Flag pais={f.pais} />
                <small>{f.pais}</small>
                <b>{f.titulo}</b>
                <span className="where">{f.lugar}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESEÑAS */}
      <section id="resenas" className="sec">
        <div className="wrap">
          <div className="sec-head row">
            <h2 data-rv>Lo que dicen <em>los papás y pacientes</em></h2>
            {SITE.reviewUrl && <a className="btn btn-line" href={SITE.reviewUrl} target="_blank" rel="noopener" data-rv>⭐ Dejar una reseña</a>}
          </div>
          <div className="quotes">
            {/* Reemplazar con reseñas reales de Google */}
            {[0, 1, 2].map((i) => (
              <figure className="quote" key={i} data-rv style={d(i * 120)}>
                <span className="qm">“</span>
                <p>Aquí se mostrará una reseña real de Google del consultorio.</p>
                <figcaption>Nombre del paciente · Google</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PREGUNTAS */}
      <section className="sec faq-sec">
        <div className="wrap faq-wrap">
          <div className="faq-side" data-rv>
            <h2>Preguntas <em>frecuentes</em></h2>
            <p>¿No encuentra su duda? Escríbale a la doctora y le responde por WhatsApp.</p>
            <WaLink className="btn btn-ciruela" msg="Hola Dra. Vanessa, tengo una consulta." src="faq"><WaIcon /> Hacer una consulta</WaLink>
          </div>
          <FaqList items={GENERAL_FAQ} />
        </div>
      </section>

      {/* CONTACTO: banda rosa + mapa */}
      <section id="contacto" className="sec">
        <div className="wrap">
          <div className="contact-band" data-rv="scale">
            <div className="cb-text">
              <h2>Agende su <em>valoración</em></h2>
              <p>{SITE.address} · Cochabamba</p>
              <div className="cb-links">
                <WaLink className="btn btn-ciruela btn-lg" msg="Hola Dra. Vanessa, quisiera agendar una cita." src="contacto"><WaIcon /> {SITE.phoneLabel}</WaLink>
                <a className="btn btn-line dark" href={SITE.instagram} target="_blank" rel="noopener">{SITE.instagramHandle}</a>
              </div>
            </div>
            <div className="cb-map">
              <iframe title="Ubicación del consultorio" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`} />
              <a className="btn btn-white" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.mapQuery)}`} target="_blank" rel="noopener">📍 Cómo llegar</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
