"use client";
import { useRef, useState } from "react";
import { VIDEOS } from "@/lib/data";
import { track } from "@/lib/track";

export default function Videos() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playing, setPlaying] = useState(-1);
  const toggle = (i: number) => {
    const v = refs.current[i]!;
    if (v.paused) {
      refs.current.forEach((o, j) => { if (j !== i) o?.pause(); });
      v.play(); setPlaying(i); track("video_play", { video: VIDEOS[i].title });
    } else { v.pause(); setPlaying(-1); }
  };
  return (
    <div className="vids">
      {VIDEOS.map((x, i) => (
        <article className={`vid${playing === i ? " playing" : ""}`} key={x.src} data-rv style={{ ["--d" as string]: `${i * 120}ms` }}>
          <div className="scr" onClick={() => toggle(i)}>
            <video ref={(el) => { refs.current[i] = el; }} src={x.src} poster={x.poster} playsInline preload="none" onEnded={() => setPlaying(-1)} />
            <div className="play"><span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z" /></svg></span></div>
          </div>
          <div className="cap"><small>{x.who}</small><b>{x.title}</b><span>{x.desc}</span></div>
        </article>
      ))}
    </div>
  );
}
