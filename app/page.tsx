import Image from "next/image";
import Link from "next/link";
import BeforeAfter from "@/components/BeforeAfter";
import FaqList from "@/components/FaqList";
import Split from "@/components/Split";
import WaLink from "@/components/WaLink";
import { TIcon, WaIcon } from "@/components/Icons";
import { FORMACION, GENERAL_FAQ, SITE, TREATMENTS, faqJsonLd } from "@/lib/data";

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

const SENALES = [
  "Dientes que salen torcidos o sin espacio",
  "Mandíbula muy adelante o muy atrás",
  "Respira por la boca o ronca",
  "Se chupa el dedo o usa chupón después de los 3 años",
  "La mordida no cierra bien o está cruzada",
  "Dificultad para masticar o hablar",
];

export default function Home() {
  const marquee = [...TREATMENTS, ...TREATMENTS];
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(GENERAL_FAQ)) }} />

      <section className="hero v-hero">
        <div className="wrap hero-grid">
          <div>
            <span className="kicker hero-in" style={d(0)}>Torres Sofer · Cochabamba</span>
            <h1><Split text="Sonrisas que *crecen* sanas y alineadas." base={150} /></h1>
            <p className="lead hero-in" style={d(650)}>Ortodoncia y ortopedia maxilar para niños, jóvenes y adultos. Un plan claro desde la primera cita, con formación en Estados Unidos, Bolivia, Uruguay y Brasil.</p>
            <div className="cta-row hero-in" style={d(800)}>
              <WaLink className="btn btn-wa" msg="Hola Dra. Vanessa, quisiera agendar una valoración." src="hero"><WaIcon /> Agenda tu valoración</WaLink>
              <Link className="btn btn-ghost" href="#tratamientos">Ver tratamientos</Link>
            </div>
            <div className="facts hero-in" style={d(950)}>
              <div><b data-count="8">0</b>tratamientos</div>
              <div><b data-count="4">0</b>países de formación</div>
              <div><b>Niños</b>y adultos</div>
            </div>
          </div>
          <div className="v-portrait">
            <div className="v-blob" />
            <div className="v-ring" />
            <div className="v-photo">
              <Image src="/img/dra-vanessa.png" alt="Dra. Vanessa Vittorini Sangueza, ortodoncista en Cochabamba" width={512} height={512} priority />
            </div>
            <div className="v-chip c1"><b>{SITE.shortName}</b><span>Odontóloga · Ortodoncista</span></div>
            <div className="v-chip c2"><b>Brackets y ortopedia</b><span>Plan a tu medida</span></div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden>
        <div className="track">{marquee.map((t, i) => <span key={i}>{t.t}</span>)}</div>
      </div>

      <section id="tratamientos">
        <div className="wrap">
          <span className="kicker" data-rv>Tratamientos</span>
          <h2 data-rv style={d(80)}>¿Qué necesita <span className="it">su sonrisa</span>?</h2>
          <p className="lead" data-rv style={d(160)}>Cada tratamiento tiene su propia página con lo que incluye, cómo es el proceso y las dudas más comunes.</p>
          <div className="tgrid">
            {TREATMENTS.map((t, i) => (
              <Link className="tcard" href={`/tratamientos/${t.slug}`} key={t.slug} data-rv style={d((i % 4) * 90)}>
                <span className="ico"><TIcon name={t.icon} /></span>
                <small>{t.cat}</small><h3>{t.t}</h3><p>{t.short}</p>
                <span className="more">Ver tratamiento →</span>
              </Link>
            ))}
          </div>
          <div className="help" data-rv="scale">
            <div><h3>¿No sabe cuál necesita?</h3><p>Es lo más común. En la valoración la doctora revisa el caso y le explica las opciones, sin compromiso.</p></div>
            <WaLink className="btn" msg="Hola Dra. Vanessa, no sé qué tratamiento necesito, quisiera una valoración." src="ayuda">Quiero una valoración →</WaLink>
          </div>
        </div>
      </section>

      <section className="philo" id="papas">
        <div className="wrap philo-grid v-papas">
          <div>
            <span className="kicker">Para papás</span>
            <h2 style={{ color: "#fff", marginTop: 14 }} data-rv="left">¿Cuándo llevar a su hijo a la <em className="it" style={{ color: "#f2b8cf" }}>ortodoncista</em>?</h2>
            <p data-rv style={d(120)}>Una primera revisión alrededor de los 6 a 7 años permite detectar a tiempo problemas de crecimiento y de mordida. Muchas veces, tratar temprano hace que todo sea más simple después.</p>
            <WaLink className="btn" msg="Hola Dra. Vanessa, quisiera una valoración para mi hijo/a." src="papas">Agendar valoración para mi hijo →</WaLink>
          </div>
          <ul className="v-senales">
            {SENALES.map((s, i) => <li key={s} data-rv="right" style={d(i * 80)}><span>{String(i + 1).padStart(2, "0")}</span>{s}</li>)}
          </ul>
        </div>
      </section>

      <section id="casos">
        <div className="wrap">
          <span className="kicker" data-rv>Antes y después</span>
          <h2 data-rv style={d(80)}>Resultados <span className="it">reales</span>.</h2>
          <p className="lead" data-rv style={d(160)}>Desliza para comparar. Casos del consultorio, publicados con autorización de cada paciente.</p>
          <div className="ba-grid">
            {/* Reemplazar con fotos reales: <BeforeAfter title="..." before="/casos/1-antes.jpg" after="/casos/1-despues.jpg" /> */}
            <BeforeAfter title="Ortodoncia con brackets" />
            <BeforeAfter title="Ortopedia maxilar" d={120} />
            <BeforeAfter title="Apiñamiento" d={240} />
          </div>
          <p className="note">Espacio reservado: aquí se cargan las fotos reales de antes y después que envíe el consultorio.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }} id="formacion">
        <div className="wrap">
          <span className="kicker" data-rv>Formación</span>
          <h2 data-rv style={d(80)}>Aprendido en <span className="it">cuatro países</span>, al servicio de su sonrisa.</h2>
          <div className="v-form">
            {FORMACION.map((f, i) => (
              <div className="v-fcard" key={f.lugar} data-rv style={d(i * 110)}>
                <small>{f.pais}</small><b>{f.titulo}</b><span>{f.lugar}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews" id="resenas">
        <div className="wrap">
          <div className="rv-head">
            <div><span className="kicker" data-rv>Reseñas</span><h2 data-rv style={d(80)}>Lo que dicen <span className="it">los pacientes</span>.</h2></div>
            <a className="qr" href={SITE.reviewUrl} target="_blank" rel="noopener" data-rv="scale"><span className="box" /><div><b>¿Ya se atendió?</b><span>Déjenos su reseña en Google →</span></div></a>
          </div>
          <div className="rgrid">
            {/* Reemplazar con reseñas reales de Google */}
            {[0, 1, 2].map((i) => (
              <div className="rcard" key={i} data-rv style={d(i * 120)}>
                <div><div className="stars">★★★★★</div><p>Aquí se mostrará una reseña real de Google del consultorio.</p></div>
                <small>Nombre del paciente · Google</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <span className="kicker" data-rv>Su primera visita</span>
          <h2 data-rv style={d(80)}>Empezar es <span className="it">simple</span>.</h2>
          <div className="steps">
            {[["Escribe por WhatsApp", "Cuenta qué le preocupa y elige día y hora."], ["Valoración", "La doctora revisa dientes, mordida y crecimiento."], ["Plan claro", "Opciones, tiempos y presupuesto explicados, sin letra chica."], ["Tratamiento y controles", "Acompañamiento en cada etapa hasta el resultado."]].map(([b, p], i) => (
              <div className="step" key={b} data-rv style={d(i * 110)}><span className="n">{i + 1}</span><b>{b}</b><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap faq-grid">
          <div>
            <span className="kicker" data-rv>Preguntas frecuentes</span>
            <h2 data-rv style={d(80)}>Lo que más <span className="it">preguntan</span>.</h2>
            <p className="lead" data-rv style={d(160)}>¿Otra duda? Escríbale a la doctora por WhatsApp.</p>
          </div>
          <FaqList items={GENERAL_FAQ} />
        </div>
      </section>

      <section id="contacto" style={{ paddingTop: 0 }}>
        <div className="wrap contact">
          <div className="cbox" data-rv="left">
            <span className="kicker">Contacto</span>
            <h2>Hablemos de <span className="it">su sonrisa</span>.</h2>
            <div className="clist">
              <WaLink msg="Hola Dra. Vanessa, quisiera agendar una cita." src="contacto"><span className="ic"><WaIcon /></span><span><small>WhatsApp</small>{SITE.phoneLabel}</span></WaLink>
              <div><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg></span><span><small>Consultorio</small>{SITE.address} · Cochabamba</span></div>
              <a href={SITE.instagram} target="_blank" rel="noopener"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg></span><span><small>Instagram</small>{SITE.instagramHandle}</span></a>
            </div>
            <WaLink className="btn" msg="Hola Dra. Vanessa, quisiera agendar una cita." src="contacto-btn"><WaIcon /> Escribir por WhatsApp</WaLink>
          </div>
          <div className="map" data-rv="right">
            <iframe title="Ubicación del consultorio" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`} />
            <a className="btn go" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.mapQuery)}`} target="_blank" rel="noopener">📍 Cómo llegar</a>
          </div>
        </div>
      </section>
    </main>
  );
}
