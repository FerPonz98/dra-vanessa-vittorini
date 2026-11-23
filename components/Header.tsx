"use client";
import Link from "next/link";
import { useState } from "react";
import WaLink from "./WaLink";
import { LOGO_BANDAS, LOGO_VIEWBOX } from "@/lib/logo";

const NAV = [["/#tratamientos", "Tratamientos"], ["/#papas", "Para papás"], ["/#casos", "Antes y después"], ["/#formacion", "Formación"], ["/#contacto", "Contacto"]];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header id="top">
      <div className="wrap nav">
        <Link className="logo" href="/" aria-label="Inicio"><span className="mk" data-logo-sitio><svg viewBox={LOGO_VIEWBOX} aria-hidden><path fill="currentColor" fillRule="evenodd" d={LOGO_BANDAS.join("")} /></svg></span><span><b>Dra. Vanessa Vittorini</b><small>Ortodoncia · Odontología</small></span></Link>
        <nav className={`links${open ? " open" : ""}`} id="links">
          {NAV.map(([h, l]) => <Link key={h} href={h} onClick={() => setOpen(false)}>{l}</Link>)}
        </nav>
        <WaLink className="btn btn-wa" msg="Hola Dra. Vanessa, quisiera agendar una valoración." src="header">Agendar valoración</WaLink>
        <button className="burger" aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
      </div>
    </header>
  );
}
