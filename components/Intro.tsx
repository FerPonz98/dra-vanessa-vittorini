"use client";
/**
 * Intro de la portada (misma idea que la del CAC): una pluma traza el logo banda por banda,
 * aparece el relleno y el nombre, el logo vuela a su lugar en el menú y el fondo se abre en dos.
 * Solo corre si <html> tiene data-intro (lo decide el script previo de app/layout.tsx):
 * portada, primera vez en la sesión, sin #ancla y sin "reducir movimiento".
 * Un clic o una tecla la saltan. Si algo falla, la página se muestra sola a los 5 s.
 */
import { useEffect, useRef } from "react";
import { LOGO_BANDAS, LOGO_VIEWBOX } from "@/lib/logo";

const T = {
  trazo: [0, 1700],
  relleno: [1450, 1950],
  nombre: [1600, 2100],
  nombreSale: [2100, 2350],
  vuelo: [2150, 2850],
  apertura: [2400, 3050],
  fin: 3200,
} as const;

const limitar = (v: number) => Math.min(1, Math.max(0, v));
const tramo = (ms: number, [a, b]: readonly [number, number]) => limitar((ms - a) / (b - a));
const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const salida = (t: number) => 1 - Math.pow(1 - t, 3);

export default function Intro() {
  const capaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = document.documentElement;
    const capa = capaRef.current;
    const listo = () => document.body.classList.add("ready");

    if (!raiz.hasAttribute("data-intro") || !capa) {
      raiz.removeAttribute("data-intro");
      listo();
      return;
    }
    try { sessionStorage.setItem("intro-vista", "1"); } catch {}

    const marca = capa.querySelector<SVGSVGElement>(".intro__marca")!;
    const relleno = capa.querySelector<SVGPathElement>(".intro__relleno")!;
    const tintas = Array.from(capa.querySelectorAll<SVGPathElement>(".intro__tinta"));
    const pluma = capa.querySelector<SVGCircleElement>(".intro__pluma")!;
    const nombre = capa.querySelector<HTMLElement>(".intro__nombre")!;
    const [arriba, abajo] = Array.from(capa.querySelectorAll<HTMLElement>(".intro__panel"));
    const logo = document.querySelector<HTMLElement>("[data-logo-sitio]");

    // Cada banda se traza en un tiempo proporcional a su largo.
    const largos = tintas.map((t) => t.getTotalLength());
    const total = largos.reduce((a, b) => a + b, 0);
    let acc = 0;
    const tramos = largos.map((l) => { const d = acc / total; acc += l; return [d, acc / total] as const; });

    let inicio = 0;
    let vuelo: { x: number; y: number; escala: number; desvanecer?: boolean } | null = null;
    let terminada = false;
    let abrio = false;
    let raf = 0;

    const terminar = () => {
      if (terminada) return;
      terminada = true;
      cancelAnimationFrame(raf);
      raiz.removeAttribute("data-intro");
      listo();
      removeEventListener("keydown", saltar);
    };

    function saltar() {
      if (terminada) return;
      inicio = -Infinity;
      capa!.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "ease-out", fill: "forwards" }).finished.then(terminar, terminar);
    }
    capa.addEventListener("pointerdown", saltar, { once: true });
    addEventListener("keydown", saltar);
    const seguridad = setTimeout(terminar, 5000);

    // FLIP: de la marca en el centro al logo del menú.
    const calcularVuelo = () => {
      const desde = marca.getBoundingClientRect();
      const caja = logo?.getBoundingClientRect();
      if (!caja || !caja.width) return { x: 0, y: 0, escala: 1, desvanecer: true };
      return { x: caja.left - desde.left, y: caja.top - desde.top, escala: caja.width / desde.width };
    };

    const cuadro = (ahora: number) => {
      if (terminada || inicio === -Infinity) return;
      if (!inicio) inicio = ahora;
      const ms = ahora - inicio;

      // 1. La pluma traza el contorno, banda por banda.
      const trazado = limitar(ms / T.trazo[1]);
      let punta: { t: SVGPathElement; av: number; l: number } | null = null;
      tintas.forEach((t, i) => {
        const [d, h] = tramos[i];
        const av = suave(limitar((trazado - d) / (h - d)));
        t.style.strokeDashoffset = String(1 - av);
        if (av > 0 && av < 1) punta = { t, av, l: largos[i] };
      });
      if (punta) {
        const { t, av, l } = punta as { t: SVGPathElement; av: number; l: number };
        const p = t.getPointAtLength(av * l);
        pluma.setAttribute("cx", p.x.toFixed(1));
        pluma.setAttribute("cy", p.y.toFixed(1));
        pluma.style.opacity = String(Math.min(1, av * 10, (1 - av) * 10));
      } else pluma.style.opacity = "0";

      // 2. Aparece el relleno y el trazo se funde con él.
      const lleno = salida(tramo(ms, T.relleno));
      relleno.style.opacity = String(lleno);
      tintas.forEach((t) => (t.style.opacity = String(1 - lleno)));

      // 3. El nombre aparece debajo y se va cuando el logo vuela.
      const aparece = salida(tramo(ms, T.nombre));
      const seVa = tramo(ms, T.nombreSale);
      nombre.style.opacity = String(aparece * (1 - seVa));
      nombre.style.transform = `translateY(${((1 - aparece) * 12 - seVa * 8).toFixed(2)}px)`;
      nombre.style.letterSpacing = `${(0.32 - aparece * 0.1).toFixed(3)}em`;

      // 4. El logo vuela a su lugar en el menú.
      if (ms >= T.vuelo[0]) {
        vuelo ??= calcularVuelo();
        const v = suave(tramo(ms, T.vuelo));
        marca.style.transform = `translate(${(vuelo.x * v).toFixed(2)}px, ${(vuelo.y * v).toFixed(2)}px) scale(${(1 + (vuelo.escala - 1) * v).toFixed(4)})`;
        if (vuelo.desvanecer) marca.style.opacity = String(1 - v);
      }

      // 5. El fondo se abre en dos y revela la portada, que entra mientras tanto.
      const a = suave(tramo(ms, T.apertura));
      arriba.style.transform = `translateY(${(-101 * a).toFixed(2)}%)`;
      abajo.style.transform = `translateY(${(101 * a).toFixed(2)}%)`;
      if (a > 0 && !abrio) { abrio = true; listo(); }

      if (ms >= T.fin) return terminar();
      raf = requestAnimationFrame(cuadro);
    };
    raf = requestAnimationFrame(cuadro);

    return () => { clearTimeout(seguridad); cancelAnimationFrame(raf); removeEventListener("keydown", saltar); };
  }, []);

  return (
    <div className="intro" ref={capaRef} aria-hidden>
      <span className="intro__panel intro__panel--arriba" />
      <span className="intro__panel intro__panel--abajo" />
      <div className="intro__centro">
        <svg className="intro__marca" viewBox={LOGO_VIEWBOX} overflow="visible">
          <path className="intro__relleno" fillRule="evenodd" d={LOGO_BANDAS.join("")} />
          {LOGO_BANDAS.map((d, i) => <path key={i} className="intro__tinta" pathLength={1} d={d} />)}
          <circle className="intro__pluma" r={22} cx={-100} cy={-100} />
        </svg>
        <div className="intro__nombre">
          <p>Dra. Vanessa Vittorini Sangueza</p>
          <small>Ortodoncia · Ortopedia maxilar</small>
        </div>
      </div>
    </div>
  );
}
