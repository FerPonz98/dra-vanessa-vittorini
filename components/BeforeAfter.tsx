"use client";
import { useRef, useState } from "react";

/** Comparador antes/después. Pasar `before` y `after` con las fotos reales del consultorio. */
export default function BeforeAfter({ title, before, after, d = 0 }: { title: string; before?: string; after?: string; d?: number }) {
  const [p, setP] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const set = (x: number) => { const r = ref.current!.getBoundingClientRect(); setP(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100))); };
  return (
    <figure className="ba" data-rv style={{ ["--d" as string]: `${d}ms` }}>
      <div className="cmp" ref={ref}
        onPointerDown={(e) => { drag.current = true; ref.current!.setPointerCapture(e.pointerId); set(e.clientX); }}
        onPointerMove={(e) => drag.current && set(e.clientX)}
        onPointerUp={() => (drag.current = false)}>
        <div className="side before" style={before ? { background: `url(${before}) center/cover` } : undefined}><span className="tag">ANTES</span>{!before && "Foto de antes"}</div>
        <div className="side after" style={{ clipPath: `inset(0 0 0 ${p}%)`, ...(after ? { background: `url(${after}) center/cover` } : {}) }}><span className="tag">DESPUÉS</span>{!after && "Foto de después"}</div>
        <div className="handle" style={{ left: `${p}%` }} />
      </div>
      <figcaption><b>{title}</b><span>Caso del consultorio</span></figcaption>
    </figure>
  );
}
