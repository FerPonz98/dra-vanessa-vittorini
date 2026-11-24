import type { IconName } from "@/lib/data";

const P: Record<IconName, React.ReactNode> = {
  smile: <><path d="M4 10c3 6 13 6 16 0" /><path d="M8 11.5v2M12 12v2.4M16 11.5v2" /></>,
  crown: <path d="M4 9l4 3 4-6 4 6 4-3-2 9H6z" />,
  jaw: <><path d="M5 8c0 6 3 11 7 11s7-5 7-11" /><circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" /></>,
  gum: <><path d="M3 9c2 2 4 2 6 0 2 2 4 2 6 0 2 2 4 2 6 0" /><path d="M6 11v5M12 11v6M18 11v5" /></>,
  shield: <><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /></>,
};

export function TIcon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {P[name]}
    </svg>
  );
}

export function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.2-.8-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2 1.2.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.2z" />
    </svg>
  );
}
