import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Página no encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: "140px 24px", textAlign: "center" }}>
      <span className="kicker">Error 404</span>
      <h1 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", margin: "10px 0 14px" }}>Esta página <span className="it">no existe</span>.</h1>
      <p style={{ color: "var(--ink-2)", marginBottom: 26 }}>Puede que el enlace haya cambiado. Vea los tratamientos desde el inicio.</p>
      <Link className="btn btn-wa" href="/">Volver al inicio</Link>
    </main>
  );
}
