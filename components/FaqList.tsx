"use client";
import { useState } from "react";
import type { Faq } from "@/lib/data";

export default function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {items.map(([q, a], i) => (
        // La animación de entrada (data-rv → clase "in") va en un contenedor aparte:
        // si estuviera en .qa, React reescribiría su className al abrir/cerrar y borraría "in".
        <div key={q} data-rv style={{ ["--d" as string]: `${i * 60}ms` }}>
          <div className={`qa${open === i ? " open" : ""}`}>
            <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{q}<i /></button>
            <div className="a"><div><p>{a}</p></div></div>
          </div>
        </div>
      ))}
    </div>
  );
}
