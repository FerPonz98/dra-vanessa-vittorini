import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Intro from "@/components/Intro";
import Motion from "@/components/Motion";
import WaLink from "@/components/WaLink";
import { WaIcon } from "@/components/Icons";
import { SITE, TREATMENTS } from "@/lib/data";

const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin-wght-normal.woff2", style: "normal", weight: "100 900" },
    { path: "./fonts/fraunces-latin-wght-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-fraunces", display: "swap",
});
const manrope = localFont({ src: "./fonts/manrope-latin-wght-normal.woff2", weight: "200 800", variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s · Dra. Vanessa Vittorini" },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "es_BO", siteName: SITE.name, title: SITE.title,
    description: "Ortodoncia y ortopedia maxilar para niños y adultos en Cochabamba. Agenda tu valoración por WhatsApp.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};
export const viewport: Viewport = { themeColor: "#2e1426" };

const dentistLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Dra. Vanessa Vittorini Sangueza · Ortodoncia y Ortopedia Maxilar",
  description: SITE.description,
  url: SITE.url,
  telephone: "+" + SITE.phone,
  image: SITE.url + "/og-image.jpg",
  address: { "@type": "PostalAddress", streetAddress: SITE.address, addressLocality: "Cochabamba", addressCountry: "BO" },
  areaServed: SITE.city,
  sameAs: [SITE.instagram],
  founder: { "@type": "Person", name: "Vanessa Vittorini Sangueza", jobTitle: "Odontóloga · Ortodoncia y Ortopedia Maxilar" },
  availableService: TREATMENTS.map((t) => ({ "@type": "MedicalProcedure", name: t.t, url: `${SITE.url}/tratamientos/${t.slug}` })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="es" suppressHydrationWarning className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "(function(){var d=document.documentElement;try{if(sessionStorage.getItem('intro-vista'))return}catch(e){}if(location.pathname!=='/'||location.hash||!window.matchMedia||matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.setAttribute('data-intro','');setTimeout(function(){d.removeAttribute('data-intro');document.body.classList.add('ready')},5000)})();" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistLd) }} />
        <Intro />
        <Motion />
        <Header />
        {children}
        <footer>
          <div className="wrap">
            <span>© {new Date().getFullYear()} {SITE.name} · Ortodoncia y Ortopedia Maxilar · {SITE.city}</span>
            <span>Sitio por <a href={SITE.author.url} target="_blank" rel="noopener">{SITE.author.name}</a></span>
          </div>
        </footer>
        <WaLink className="float" msg="Hola Dra. Vanessa, quisiera información." src="flotante" ariaLabel="Escribir por WhatsApp"><WaIcon /><b>WhatsApp</b></WaLink>
        {ga && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}');`}</Script>
          </>
        )}
      </body>
    </html>
  );
}
