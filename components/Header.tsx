"use client";
import Link from "next/link";
import { useState } from "react";
import WaLink from "./WaLink";
import { LOGO_BANDAS, LOGO_VIEWBOX } from "@/lib/logo";

const NAV = [["/#tratamientos", "Tratamientos"], ["/#papas", "Para papás"], ["/#casos", "Casos"], ["/#formacion", "Formación"], ["/#contacto", "Contacto"]];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header id="top" className="pill-header">
      <div className="pill">
        <Link className="logo" href="/" aria-label="Inicio">
          <span className="mk" data-logo-sitio><svg viewBox={LOGO_VIEWBOX} aria-hidden><path fill="currentColor" d={LOGO_BANDAS.join("")} /></svg></span>
          <span className="logo-t"><b>Dra. Vanessa Vittorini</b></span>
        </Link>
        <nav className={`links${open ? " open" : ""}`} id="links">
          {NAV.map(([h, l]) => <Link key={h} href={h} onClick={() => setOpen(false)}>{l}</Link>)}
        </nav>
        <WaLink className="btn btn-rosa" msg="Hola Dra. Vanessa, quisiera agendar una valoración." src="header">Agendar</WaLink>
        <button className="burger" aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
      </div>
    </header>
  );
}
