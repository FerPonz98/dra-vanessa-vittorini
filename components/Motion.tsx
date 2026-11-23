"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Reveal al hacer scroll, barra de progreso, header que se oculta, parallax y contadores. */
export default function Motion() {
  const path = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    const els = document.querySelectorAll("[data-rv]:not(.in), .split-rv:not(.in)");
    els.forEach((el) => io.observe(el));

    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    const cio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement; const end = Number(el.dataset.count); const t0 = performance.now();
      const step = (t: number) => { const p = Math.min(1, (t - t0) / 1400); el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step); cio.unobserve(el);
    }), { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));

    return () => { io.disconnect(); cio.disconnect(); };
  }, [path]);

  useEffect(() => {
    const hdr = document.getElementById("top");
    const bar = document.querySelector<HTMLElement>(".progress");
    let last = 0; let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = scrollY; const max = document.documentElement.scrollHeight - innerHeight;
        bar?.style.setProperty("--p", String(max > 0 ? y / max : 0));
        hdr?.classList.toggle("solid", y > 20);
        hdr?.classList.toggle("hide", y > 400 && y > last && !document.getElementById("links")?.classList.contains("open"));
        last = y;
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
          const r = el.getBoundingClientRect(); const k = Number(el.dataset.parallax) || 0.08;
          el.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * -k}px,0)`;
        });
      });
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, [path]);

  return <div className="progress" aria-hidden />;
}
