"use client";
import { waLink } from "@/lib/data";
import { track } from "@/lib/track";

export default function WaLink({ msg, src, t, className, children, ariaLabel }: {
  msg: string; src: string; t?: string; className?: string; children: React.ReactNode; ariaLabel?: string;
}) {
  return (
    <a className={className} href={waLink(msg)} target="_blank" rel="noopener" aria-label={ariaLabel}
      onClick={() => track("whatsapp_click", { origen: src, tratamiento: t ?? "" })}>
      {children}
    </a>
  );
}
