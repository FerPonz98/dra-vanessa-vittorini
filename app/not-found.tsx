import Link from "next/link";
export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: "140px 24px", textAlign: "center" }}>
      <span className="kicker">Error 404</span>
      <h2>Esta página <span className="it">no existe</span>.</h2>
      <Link className="btn btn-wa" href="/" style={{ marginTop: 20 }}>Volver al inicio</Link>
    </main>
  );
}
