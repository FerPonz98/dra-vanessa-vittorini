declare global { interface Window { gtag?: (...a: unknown[]) => void } }
export function track(name: string, params: Record<string, string> = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") window.gtag("event", name, params);
}
