"use client";
import Image from "next/image";
import { useState } from "react";
export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  return (<div><div className="relative aspect-square rounded-3xl overflow-hidden bg-white"><Image src={images[i]} alt={alt} fill priority={i === 0} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" /></div>
    {images.length > 1 && <div className="mt-3 flex gap-2">{images.map((s, k) => <button key={s} onClick={() => setI(k)} aria-label={`Show image ${k + 1}`} aria-pressed={k === i} className={`relative h-16 w-16 rounded-xl overflow-hidden border-2 ${k === i ? "border-accent" : "border-transparent"}`}><Image src={s} alt="" fill sizes="64px" className="object-cover" /></button>)}</div>}</div>);
}
