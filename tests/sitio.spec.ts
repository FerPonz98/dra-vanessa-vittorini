import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test, expect, type Page, type Locator } from "@playwright/test";
import { TREATMENTS, GENERAL_FAQ, SITE } from "../lib/data";

/*
 * Pruebas de punta a punta del sitio de la Dra. Vanessa Vittorini.
 * Corren en 3 tamaños (ver playwright.config.ts): 1440 px, 768 px y 390 px.
 * npm run test:e2e
 */

const PAGINAS = ["/", ...TREATMENTS.map((t) => `/tratamientos/${t.slug}`)];
const WA_DOCTORA = `https://wa.me/${SITE.phone}?text=`;
const esMenuMovil = (page: Page) => (page.viewportSize()?.width ?? 1440) <= 1000;

/** Marca la intro como vista para que no tape la página en las pruebas que no son de la intro. */
async function sinIntro(page: Page) {
  await page.addInitScript(() => { try { sessionStorage.setItem("intro-vista", "1"); } catch {} });
}

/** Junta errores de consola, excepciones y respuestas >= 400 de la página. */
function vigilar(page: Page) {
  const errores: string[] = [];
  const rotos: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errores.push(`${m.text()} @ ${m.location().url}`); });
  page.on("pageerror", (e) => errores.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    const tipo = r.request().resourceType();
    const propio = r.url().startsWith(new URL(page.url() || "http://localhost").origin) || r.url().includes("localhost");
    if (r.status() >= 400 && (propio || ["image", "font", "stylesheet", "script"].includes(tipo))) rotos.push(`${r.status()} ${tipo} ${r.url()}`);
  });
  return { errores, rotos };
}

/** Recorre la página hasta abajo para disparar las imágenes diferidas y los reveals. */
async function recorrer(page: Page) {
  await page.evaluate(async () => {
    const paso = innerHeight * 0.7;
    for (let y = 0; y < document.documentElement.scrollHeight; y += paso) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 300));
  });
}

async function cajasSeCruzan(a: Locator, b: Locator) {
  const [x, y] = [await a.boundingBox(), await b.boundingBox()];
  if (!x || !y) return false;
  return x.x < y.x + y.width && x.x + x.width > y.x && x.y < y.y + y.height && x.y + x.height > y.y;
}

// ───────────────────────── IMÁGENES Y RECURSOS ─────────────────────────
test.describe("Imágenes y recursos", () => {
  for (const ruta of [...PAGINAS, "/tratamientos/no-existe"]) {
    test(`sin recursos rotos ni desbordes: ${ruta}`, async ({ page }) => {
      await sinIntro(page);
      const { rotos } = vigilar(page);
      const r = await page.goto(ruta);
      expect(r?.status()).toBe(ruta.includes("no-existe") ? 404 : 200);
      await recorrer(page);
      await page.waitForLoadState("networkidle");
      const malas = await page.$$eval("img", (imgs) =>
        imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
      expect(malas, "imágenes que no cargan").toEqual([]);
      // el documento de la ruta inexistente responde 404 a propósito
      expect(rotos.filter((x) => !x.includes("/tratamientos/no-existe")), "recursos con error").toEqual([]);
      // nada se sale de la pantalla hacia los costados
      const ancho = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, vp: innerWidth }));
      expect(ancho.doc, "desborde horizontal").toBeLessThanOrEqual(ancho.vp);
    });
  }

  test("og-image.jpg e icon.png existen", async ({ request }) => {
    for (const [ruta, tipo] of [["/og-image.jpg", "image/jpeg"], ["/icon.png", "image/png"]]) {
      const r = await request.get(ruta);
      expect(r.status(), ruta).toBe(200);
      expect(r.headers()["content-type"]).toContain(tipo);
    }
  });

  test("la foto de la doctora se ve completa dentro del círculo", async ({ page }) => {
    await sinIntro(page);
    await page.goto("/");
    const foto = page.locator(".hc-photo img");
    await expect(foto).toBeVisible();
    // termina la animación de apertura del círculo
    await expect.poll(() => foto.evaluate((el) => getComputedStyle(el).clipPath)).toContain("50%");
    await page.waitForTimeout(1800);
    const m = await foto.evaluate((el: HTMLImageElement) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { w: r.width, h: r.height, nw: el.naturalWidth, nh: el.naturalHeight, radio: cs.borderRadius, fit: cs.objectFit, clip: cs.clipPath };
    });
    expect(m.nw).toBeGreaterThan(0);
    expect(Math.abs(m.w / m.h - m.nw / m.nh), "la foto no está deformada ni recortada").toBeLessThan(0.02);
    expect(m.radio).toBe("50%");
    expect(m.clip).toMatch(/circle\(50%/);
    // la foto y los stickers quedan dentro de la tarjeta (sin cortes)
    const tarjeta = await page.locator(".hero-card").boundingBox();
    for (const el of [foto, page.locator(".sticker.s1"), page.locator(".sticker.s2")]) {
      const b = (await el.boundingBox())!;
      expect(b.x, "se corta a la izquierda").toBeGreaterThanOrEqual(tarjeta!.x - 1);
      expect(b.x + b.width, "se corta a la derecha").toBeLessThanOrEqual(tarjeta!.x + tarjeta!.width + 1);
    }
  });
});

// ───────────────────────── INTRO ─────────────────────────
test.describe("Intro", () => {
  test("primera visita: dibuja el Vv, muestra el nombre, se abre en círculo y queda usable en < 4 s", async ({ page }) => {
    // Muestreo cuadro a cuadro dentro de la página: el nombre se ve ~400 ms, un sondeo externo podría perderlo.
    await page.addInitScript(() => {
      const w = window as unknown as { __intro: { trazo: number; nombre: number; radio: number; usable: number } };
      w.__intro = { trazo: 1, nombre: 0, radio: 0, usable: 0 };
      const t0 = performance.now();
      const mirar = () => {
        const s = w.__intro;
        const tinta = document.querySelector<SVGPathElement>(".intro__tinta");
        const nombre = document.querySelector<HTMLElement>(".intro__nombre");
        const panel = document.querySelector<HTMLElement>(".intro__panel--arriba");
        if (tinta?.style.strokeDashoffset) s.trazo = Math.min(s.trazo, Number(tinta.style.strokeDashoffset));
        if (nombre) s.nombre = Math.max(s.nombre, Number(getComputedStyle(nombre).opacity));
        const m = panel ? panel.style.maskImage || panel.style.webkitMaskImage : "";
        const r = /radial-gradient\(circle.*?transparent ([\d.]+)px/.exec(m ?? "");
        if (r) s.radio = Math.max(s.radio, Number(r[1]));
        if (document.body && !document.documentElement.hasAttribute("data-intro") && document.body.classList.contains("ready")) { s.usable = performance.now() - t0; return; }
        requestAnimationFrame(mirar);
      };
      requestAnimationFrame(mirar);
    });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "");
    await expect(page.locator(".intro")).toBeVisible();
    await expect(page.locator(".intro__nombre")).toContainText("Dra. Vanessa Vittorini");
    // queda usable
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", /.*/, { timeout: 4000 });
    await expect(page.locator("body")).toHaveClass(/ready/);
    const s = await page.evaluate(() => (window as unknown as { __intro: { trazo: number; nombre: number; radio: number; usable: number } }).__intro);
    expect(s.trazo, "el Vv se dibuja (el trazo llega al final)").toBeLessThan(0.05);
    expect(s.nombre, "aparece el nombre").toBeGreaterThan(0.9);
    expect(s.radio, "la página se abre en círculo").toBeGreaterThan(300);
    expect(s.usable, "ms hasta que la página es usable").toBeGreaterThan(2000);
    expect(s.usable, "ms hasta que la página es usable").toBeLessThan(4000);
    await expect(page.locator(".intro")).toBeHidden();
    await page.locator(".hc-cta .btn-line").click();
    await expect(page).toHaveURL(/#papas$/);
  });

  test("al recargar en la misma sesión ya no aparece", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", /.*/, { timeout: 4500 });
    await page.reload();
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", /.*/);
    await expect(page.locator(".intro")).toBeHidden();
    await expect(page.locator("body")).toHaveClass(/ready/);
  });

  test("un clic durante la intro la salta", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "");
    await page.waitForTimeout(400);
    const t = Date.now();
    await page.mouse.click(200, 300);
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", /.*/, { timeout: 1000 });
    expect(Date.now() - t).toBeLessThan(1000);
    await expect(page.locator("body")).toHaveClass(/ready/);
  });

  test("no aparece al entrar con #ancla ni en /tratamientos/*", async ({ page }) => {
    for (const ruta of ["/#contacto", `/tratamientos/${TREATMENTS[0].slug}`]) {
      await page.goto(ruta);
      await expect(page.locator("html"), ruta).not.toHaveAttribute("data-intro", /.*/);
      await expect(page.locator(".intro"), ruta).toBeHidden();
      await expect(page.locator("body")).toHaveClass(/ready/);
    }
  });
});

// ───────────────────────── NAVEGACIÓN ─────────────────────────
const MENU: [string, string][] = [["Tratamientos", "tratamientos"], ["Para papás", "papas"], ["Casos", "casos"], ["Formación", "formacion"], ["Contacto", "contacto"]];

test.describe("Navegación", () => {
  for (const desde of ["/", `/tratamientos/${TREATMENTS[2].slug}`]) {
    test(`cada enlace del menú lleva a su sección (desde ${desde})`, async ({ page }) => {
      await sinIntro(page);
      for (const [texto, id] of MENU) {
        await page.goto(desde);
        if (esMenuMovil(page)) await page.locator(".burger").click();
        await page.locator("#links").getByRole("link", { name: texto, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`/#${id}$`));
        await expect.poll(() => page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top)), { message: `#${id} visible` })
          .toBeLessThan(160);
        await expect(page.locator(`#${id}`)).toBeInViewport();
      }
    });
  }

  test("en celular/tablet el menú abre, cierra y se cierra al tocar un enlace", async ({ page }) => {
    await sinIntro(page);
    await page.goto("/");
    if (!esMenuMovil(page)) {
      await expect(page.locator(".burger")).toBeHidden();
      await expect(page.locator("#links")).toBeVisible();
      return;
    }
    const burger = page.locator(".burger");
    const menu = page.locator("#links");
    await expect(menu).toBeHidden();
    await burger.click();
    await expect(menu).toBeVisible();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await burger.click();
    await expect(menu).toBeHidden();
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await burger.click();
    await menu.getByRole("link", { name: "Casos" }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#casos$/);
  });

  test("el header se esconde al bajar y aparece al subir", async ({ page }) => {
    await sinIntro(page);
    await page.goto("/");
    const hdr = page.locator("#top");
    const ir = (y: number) => page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
    await ir(600); await page.waitForTimeout(150);
    await ir(1400); await page.waitForTimeout(150);
    await expect(hdr).toHaveClass(/hide/);
    await expect.poll(async () => (await hdr.boundingBox())!.y + (await hdr.boundingBox())!.height).toBeLessThanOrEqual(1);
    await ir(1000); await page.waitForTimeout(150);
    await expect(hdr).not.toHaveClass(/hide/);
    await expect(hdr).toBeInViewport();
  });
});

// ───────────────────────── TRATAMIENTOS ─────────────────────────
test.describe("Tratamientos", () => {
  test("8 tarjetas en el bento y cada una abre su página con 200", async ({ page, request }) => {
    await sinIntro(page);
    await page.goto("/");
    const cards = page.locator(".bento > a.b-card");
    await expect(cards).toHaveCount(8);
    const hrefs = await cards.evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(TREATMENTS.map((t) => `/tratamientos/${t.slug}`));
    for (const h of hrefs) expect((await request.get(h!)).status(), h!).toBe(200);
    // el clic real navega
    await cards.nth(3).click();
    await expect(page).toHaveURL(new RegExp(`${hrefs[3]}$`));
    await expect(page.locator("h1")).toHaveText(TREATMENTS[3].t);
  });

  for (const t of TREATMENTS) {
    test(`página completa: ${t.slug}`, async ({ page }) => {
      await sinIntro(page);
      await page.goto(`/tratamientos/${t.slug}`);
      await expect(page.locator("h1")).toHaveText(t.t);
      await expect(page.locator(".tags span")).toHaveText(t.tags);
      await expect(page.getByRole("heading", { level: 2, name: "¿Es para usted?" })).toBeVisible();
      await expect(page.locator(".who > div")).toHaveCount(t.who.length);
      await expect(page.locator(".steps4 > li")).toHaveCount(4);
      await expect(page.locator(".steps4 h3")).toHaveText(t.steps.map((s) => s[0]));
      await expect(page.locator(".qa")).toHaveCount(t.faq.length);
      await expect(page.locator(".qa button")).toHaveText(t.faq.map((f) => f[0]));
      await expect(page.getByRole("heading", { level: 2, name: "Otros tratamientos" })).toBeAttached();
      await expect(page.locator(".mini > a.b-card")).toHaveCount(4);
      const otros = await page.locator(".mini > a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
      expect(otros).not.toContain(`/tratamientos/${t.slug}`);
      const wa = page.locator(".hc-cta a");
      await expect(wa).toContainText("WhatsApp");
      const texto = decodeURIComponent((await wa.getAttribute("href"))!.split("?text=")[1]);
      expect(texto).toContain(t.t);
      expect(texto.startsWith("Hola Dra. Vanessa")).toBe(true);
    });
  }

  test("una ruta inexistente muestra la página 404", async ({ page }) => {
    await sinIntro(page);
    const r = await page.goto("/tratamientos/no-existe");
    expect(r?.status()).toBe(404);
    await expect(page.getByText("no existe")).toBeVisible();
    await expect(page.getByRole("link", { name: "Volver al inicio" })).toBeVisible();
    await expect(page.locator("#top")).toBeVisible();
  });
});

// ───────────────────────── PREGUNTAS FRECUENTES ─────────────────────────
async function probarFaq(page: Page, cantidad: number) {
  const qa = page.locator(".qa");
  await expect(qa).toHaveCount(cantidad);
  const abiertas = () => qa.evaluateAll((xs) => xs.map((x, i) => (x.classList.contains("open") ? i : -1)).filter((i) => i >= 0));
  const respuestaCompleta = async (i: number) => {
    await page.waitForTimeout(600); // transición
    const m = await qa.nth(i).evaluate((el) => {
      const caja = el.querySelector(".a > div")!.getBoundingClientRect();
      const p = el.querySelector(".a p")!;
      const r = p.getBoundingClientRect();
      return { caja: caja.height, p: r.height, scroll: (p.parentElement as HTMLElement).scrollHeight };
    });
    expect(m.p, "la respuesta tiene texto").toBeGreaterThan(10);
    expect(m.caja + 1, "la respuesta se ve completa").toBeGreaterThanOrEqual(m.scroll);
    await expect(qa.nth(i).locator(".a p")).toBeVisible();
    // toBeVisible ignora la opacidad: tras abrir/cerrar, la pregunta no debe quedar transparente
    await qa.nth(i).scrollIntoViewIfNeeded();
    await expect.poll(() => qa.nth(i).evaluate((x) => {
      let o = 1;
      for (let e: Element | null = x; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
      return o;
    }), { message: "la pregunta se ve (opacidad 1)" }).toBeGreaterThan(0.99);
  };
  expect(await abiertas()).toEqual([0]);
  await expect(qa.nth(0).locator("button")).toHaveAttribute("aria-expanded", "true");
  await respuestaCompleta(0);
  await qa.nth(1).locator("button").click();
  expect(await abiertas()).toEqual([1]);
  await respuestaCompleta(1);
  const cerrada = await qa.nth(0).locator(".a > div").evaluate((el) => el.getBoundingClientRect().height);
  expect(cerrada, "la anterior se cierra").toBeLessThan(1);
  await qa.nth(1).locator("button").click();
  expect(await abiertas()).toEqual([]);
  await expect(qa.nth(1).locator("button")).toHaveAttribute("aria-expanded", "false");
  // todas las respuestas se ven completas al abrirlas
  for (let i = 0; i < cantidad; i++) {
    await qa.nth(i).locator("button").click();
    await respuestaCompleta(i);
  }
}

test.describe("Preguntas frecuentes", () => {
  test("portada", async ({ page }) => {
    await sinIntro(page);
    await page.goto("/");
    await probarFaq(page, GENERAL_FAQ.length);
  });
  for (const t of TREATMENTS) {
    test(`tratamiento: ${t.slug}`, async ({ page }) => {
      await sinIntro(page);
      await page.goto(`/tratamientos/${t.slug}`);
      await probarFaq(page, t.faq.length);
    });
  }
});

// ───────────────────────── ANTES Y DESPUÉS ─────────────────────────
test.describe("Antes y después", () => {
  const posicion = (cmp: Locator) => cmp.locator(".handle").evaluate((el) => parseFloat((el as HTMLElement).style.left));
  const recorte = (cmp: Locator) => cmp.locator(".after").evaluate((el) => (el as HTMLElement).style.clipPath);

  test("arrastrar con el mouse mueve la división", async ({ page }) => {
    await sinIntro(page);
    await page.goto("/#casos");
    const cmp = page.locator(".ba .cmp").first();
    await cmp.scrollIntoViewIfNeeded();
    const b = (await cmp.boundingBox())!;
    expect(await posicion(cmp)).toBe(50);
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width * 0.2, b.y + b.height / 2, { steps: 8 });
    await page.mouse.up();
    expect(Math.round(await posicion(cmp))).toBeCloseTo(20, -1);
    expect(await recorte(cmp)).toMatch(/inset\(0(px)? 0(px)? 0(px)? 2\d/);
    await page.mouse.move(b.x + b.width * 0.85, b.y + b.height / 2, { steps: 4 });
    expect(Math.round(await posicion(cmp)), "sin apretar no se mueve").toBeCloseTo(20, -1);
  });

  test("arrastrar con el dedo mueve la división", async ({ page, browserName }, info) => {
    test.skip(!info.project.use.hasTouch, "solo en tamaños táctiles");
    test.skip(browserName !== "chromium");
    await sinIntro(page);
    await page.goto("/#casos");
    const cmp = page.locator(".ba .cmp").nth(1);
    await cmp.scrollIntoViewIfNeeded();
    const b = (await cmp.boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    const y = b.y + b.height / 2;
    const toque = (type: "touchStart" | "touchMove" | "touchEnd", x: number) =>
      cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y, id: 1 }] });
    await toque("touchStart", b.x + b.width * 0.5);
    for (let i = 1; i <= 8; i++) await toque("touchMove", b.x + b.width * (0.5 + 0.03 * i));
    await toque("touchEnd", 0);
    expect(Math.round(await posicion(cmp))).toBeCloseTo(74, -1);
    expect(await recorte(cmp)).toMatch(/inset\(0(px)? 0(px)? 0(px)? 7\d/);
  });
});

// ───────────────────────── WHATSAPP ─────────────────────────
test.describe("WhatsApp", () => {
  for (const ruta of PAGINAS) {
    test(`enlaces a la doctora: ${ruta}`, async ({ page }) => {
      await sinIntro(page);
      await page.goto(ruta);
      const hrefs = await page.locator('a[href*="wa.me"]').evaluateAll((as) =>
        as.filter((a) => !a.closest("footer")).map((a) => a.getAttribute("href")!));
      expect(hrefs.length).toBeGreaterThanOrEqual(3);
      for (const h of hrefs) {
        expect(h.startsWith(WA_DOCTORA), h).toBe(true);
        expect(decodeURIComponent(h.slice(WA_DOCTORA.length)).startsWith("Hola Dra. Vanessa"), h).toBe(true);
      }
      // el único wa.me del pie es el crédito del sitio, que se mantiene
      const pie = await page.locator('footer a[href*="wa.me"]').allTextContents();
      expect(pie).toEqual(["FerPonz"]);
      await expect(page.locator("footer")).toContainText("Sitio web desarrollado por FerPonz");
    });
  }

  test("el botón flotante aparece y no tapa botones importantes", async ({ page }) => {
    await sinIntro(page);
    await page.goto("/");
    const flot = page.locator("a.float");
    await expect(flot).toBeInViewport({ ratio: 1 });
    await expect(flot).toHaveAttribute("href", /^https:\/\/wa\.me\/59175933292\?text=Hola%20Dra\.%20Vanessa/);
    // al cargar no tapa los botones del hero ni del header
    for (const sel of [".hc-cta .btn", ".pill .btn", ".burger"]) {
      const els = page.locator(sel);
      for (let i = 0; i < (await els.count()); i++) if (await els.nth(i).isVisible()) expect(await cajasSeCruzan(flot, els.nth(i)), sel).toBe(false);
    }
    // al final de la página no tapa el pie ni los botones de contacto
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(300);
    for (const el of await page.locator("footer a, #contacto .btn").all()) {
      if (await el.isVisible()) expect(await cajasSeCruzan(flot, el), await el.textContent() ?? "").toBe(false);
    }
    // ningún botón queda tapado mientras está quieto en el centro de la pantalla
    for (const el of await page.locator("main .btn, .qa button").all()) {
      await el.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
      expect(await cajasSeCruzan(flot, el), (await el.textContent()) ?? "").toBe(false);
    }
  });
});

// ───────────────────────── CONTACTO Y SEO ─────────────────────────
test.describe("Contacto y SEO", () => {
  test("mapa y 'Cómo llegar'", async ({ page }) => {
    await sinIntro(page);
    await page.goto("/#contacto");
    const mapa = page.locator('#contacto iframe[title="Ubicación del consultorio"]');
    await expect(mapa).toHaveCount(1);
    expect(await mapa.getAttribute("src")).toMatch(/^https:\/\/www\.google\.com\/maps\?q=Torres%20Sofer/);
    const llegar = page.getByRole("link", { name: /Cómo llegar/ });
    await expect(llegar).toBeVisible();
    const h = (await llegar.getAttribute("href"))!;
    expect(h).toMatch(/^https:\/\/www\.google\.com\/maps\/dir\//);
    expect(decodeURIComponent(h)).toContain("Torres Sofer");
  });

  test("sitemap.xml y robots.txt", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/");
    expect(locs.sort()).toEqual([...PAGINAS].sort());
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const txt = await robots.text();
    expect(txt).toContain("Allow: /");
    expect(txt).toContain("Sitemap:");
  });

  test("título, descripción y JSON-LD propios en cada página", async ({ page }) => {
    await sinIntro(page);
    const vistos = { t: new Set<string>(), d: new Set<string>() };
    for (const ruta of PAGINAS) {
      await page.goto(ruta);
      const title = await page.title();
      const desc = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      expect(title.length, `${ruta} title`).toBeGreaterThan(10);
      expect(desc.length, `${ruta} description`).toBeGreaterThan(50);
      expect(vistos.t.has(title), `title repetido: ${title}`).toBe(false);
      expect(vistos.d.has(desc), `description repetida: ${desc}`).toBe(false);
      vistos.t.add(title); vistos.d.add(desc);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${ruta === "/" ? "" : ruta}$`));
      const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
      const tipos = ld.map((s) => {
        let o: { "@type"?: string } = {};
        expect(() => (o = JSON.parse(s)), `${ruta}: JSON-LD inválido`).not.toThrow();
        return o["@type"];
      });
      expect(tipos).toContain("Dentist");
      expect(tipos).toContain("FAQPage");
      if (ruta !== "/") expect(tipos).toContain("BreadcrumbList");
    }
  });
});

// ───────────────────────── CALIDAD ─────────────────────────
test.describe("Calidad", () => {
  for (const ruta of PAGINAS) {
    test(`consola sin errores: ${ruta}`, async ({ page }) => {
      const { errores } = vigilar(page);
      await page.goto(ruta);
      await page.waitForTimeout(ruta === "/" ? 3600 : 300); // en "/" corre la intro completa
      await recorrer(page);
      await page.waitForTimeout(1500); // sin networkidle: el iframe de Google Maps mantiene conexiones abiertas
      expect(errores).toEqual([]);
    });
  }

  test("sin restos del sitio anterior en el código", async ({}, info) => {
    test.skip(info.project.name !== "escritorio-1440", "basta con revisarlo una vez");
    const PROHIBIDO = /pietro|sangüeza|implantolog|implantes|carillas|77933351/i;
    const IGNORAR = new Set(["node_modules", ".next", ".git", "test-results", "playwright-report", "sitio.spec.ts"]);
    const hallazgos: string[] = [];
    const revisar = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (IGNORAR.has(e.name)) continue;
        const ruta = join(dir, e.name);
        if (e.isDirectory()) revisar(ruta);
        else if (/\.(tsx?|mjs|js|json|css|md|txt|xml|svg|example)$/.test(e.name) || e.name.startsWith(".env")) {
          readFileSync(ruta, "utf8").split(/\r?\n/).forEach((l, i) => { if (PROHIBIDO.test(l)) hallazgos.push(`${ruta}:${i + 1}: ${l.trim().slice(0, 80)}`); });
        }
      }
    };
    revisar(process.cwd());
    expect(hallazgos).toEqual([]);
  });
});
