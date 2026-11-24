// Banderas en SVG (los emojis de banderas no se ven en Windows: muestran "US", "BO"...).
// Se muestran recortadas en círculo (.flag), así que cada una está dibujada en un cuadrado
// de 24×24 con sus elementos clave (cantón con estrellas, sol) dentro del círculo visible.

const S = 24;
const stripes = (n: number, colors: string[]) =>
  Array.from({ length: n }, (_, i) => <rect key={i} y={(S / n) * i} width={S} height={S / n + 0.05} fill={colors[i % colors.length]} />);

// Estrella de 5 puntas centrada en (x, y) con radio r.
const star = (x: number, y: number, r: number, k: string) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.4 : r;
    return `${(x + rr * Math.cos(a)).toFixed(2)},${(y + rr * Math.sin(a)).toFixed(2)}`;
  });
  return <polygon key={k} points={pts.join(" ")} fill="#fff" />;
};

// Cantón de EE.UU.: 13 franjas, cantón azul de 7 franjas de alto con estrellas en filas alternas.
const CANTON_W = 12.5, CANTON_H = (S / 13) * 7;
const usStars = [0, 1, 2, 3, 4].flatMap((row) => {
  const cols = row % 2 ? [3.6, 6.8, 10] : [2, 5.2, 8.4, 11.2].filter((x) => x < CANTON_W - 1);
  return cols.map((x) => star(x + (row % 2 ? 0 : 0.2), 2.6 + row * 2.1, 0.95, `${row}-${x}`));
});

const FLAGS: Record<string, React.ReactNode> = {
  "Estados Unidos": (
    <>
      {stripes(13, ["#b22234", "#fff"])}
      <rect width={CANTON_W} height={CANTON_H} fill="#3c3b6e" />
      {usStars}
    </>
  ),
  Bolivia: <>{stripes(3, ["#d52b1e", "#f9e300", "#007934"])}</>,
  Uruguay: (
    <>
      {stripes(9, ["#fff", "#0038a8"])}
      <rect width={11} height={(S / 9) * 5} fill="#fff" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i * Math.PI) / 8;
        return <line key={i} x1={6.6} y1={7.2} x2={6.6 + 4.2 * Math.cos(a)} y2={7.2 + 4.2 * Math.sin(a)} stroke="#fcd116" strokeWidth={0.9} />;
      })}
      <circle cx={6.6} cy={7.2} r={2.4} fill="#fcd116" stroke="#b07a00" strokeWidth={0.3} />
    </>
  ),
  Brasil: (
    <>
      <rect width={S} height={S} fill="#009c3b" />
      <path d="M12 3.2 22.4 12 12 20.8 1.6 12z" fill="#ffdf00" />
      <circle cx={12} cy={12} r={4.9} fill="#002776" />
      <path d="M7.3 11.1c3.2-.8 6.6-.3 9.4 1.5" stroke="#fff" strokeWidth={0.8} fill="none" />
    </>
  ),
};

export default function Flag({ pais }: { pais: string }) {
  const f = FLAGS[pais];
  if (!f) return null;
  return (
    <span className="flag" role="img" aria-label={`Bandera de ${pais}`}>
      <svg viewBox={`0 0 ${S} ${S}`} aria-hidden>{f}</svg>
    </span>
  );
}
