export default function Split({ text, base = 0 }: { text: string; base?: number }) {
  // Palabras entre *asteriscos* se muestran en cursiva de color
  const words = text.split(" ");
  return (
    <span className="split" style={{ ["--base" as string]: `${base}ms` }}>
      {words.map((w, i) => {
        const it = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        return (
          <span className="w" key={i}>
            <span style={{ ["--i" as string]: i }} className={it ? "it" : undefined}>{clean}</span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}
