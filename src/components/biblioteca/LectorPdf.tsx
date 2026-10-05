"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

type Pdfjs = typeof import("pdfjs-dist");

/** Niveles de zoom sobre el ajuste a pantalla: 1 es "la pagina entera cabe". */
const ZOOMS = [1, 1.25, 1.5, 2, 2.5, 3];
/** Aire alrededor de la pagina, en px, cuando esta ajustada a pantalla. */
const MARGEN = 20;
/** Paginas ya pintadas que se guardan para ir y volver sin repintar. */
const CACHE_MAX = 10;
/** Tope de pixeles por lienzo: a zoom alto en pantallas retina, una pagina
    sin tope pasa de 60 MB de memoria, y el navegador del telefono la tira. */
const PIXELES_MAX = 16_000_000;

const claveGuardado = (slug: string) => `biblioteca:pagina:${slug}`;

/**
 * Lector de la Biblioteca Virtual, sobre PDF.js.
 *
 * Se pasa pagina a pagina, como un libro: una en el telefono y a doble pagina
 * en pantallas apaisadas anchas, con la portada sola a la derecha del primer
 * pliego. El scroll queda para cuando se amplia la pagina y hay que moverse
 * por ella.
 *
 * Cada pagina se pinta en un canvas con una capa de texto encima,
 * transparente, que es la que permite seleccionar y copiar, buscar con el
 * navegador y que un lector de pantalla lea el libro. Las paginas pintadas se
 * guardan en una cache corta, y mientras se lee se adelantan el pliego
 * siguiente y el anterior para que pasar de pagina sea inmediato.
 *
 * La pagina en curso se guarda en el navegador y en el fragmento de la URL
 * (#p=37): al volver al libro se retoma donde se dejo, y un enlace con
 * fragmento abre directamente esa pagina.
 */
export default function LectorPdf({
  slug,
  titulo,
  firma,
  pdf,
  ficha,
}: {
  slug: string;
  titulo: string;
  firma: string;
  pdf: string;
  ficha: string;
}) {
  const router = useRouter();
  const areaRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pdfjsRef = useRef<Pdfjs | null>(null);
  const cacheRef = useRef(new Map<string, HTMLDivElement>());
  const turnoRef = useRef(0);
  const toqueRef = useRef<{ x: number; y: number } | null>(null);

  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando");
  const [progreso, setProgreso] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [arrastre, setArrastre] = useState<number | null>(null);
  const [nivelZoom, setNivelZoom] = useState(0);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const [base, setBase] = useState<{ w: number; h: number } | null>(null);

  const total = doc?.numPages ?? 0;
  const zoom = ZOOMS[nivelZoom];

  /* --- Carga del documento ------------------------------------------------ */
  useEffect(() => {
    let cancelado = false;
    const cache = cacheRef.current;
    let tarea: ReturnType<Pdfjs["getDocument"]> | null = null;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        /* El worker y sus recursos los copia scripts/copiar-pdfjs.mjs desde
           node_modules, de modo que siempre son de la misma version. */
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
        pdfjsRef.current = pdfjs;

        tarea = pdfjs.getDocument({
          url: pdf,
          standardFontDataUrl: "/pdfjs/standard_fonts/",
          wasmUrl: "/pdfjs/wasm/",
          iccUrl: "/pdfjs/iccs/",
        });
        tarea.onProgress = ({ loaded, total: bytes }: { loaded: number; total: number }) => {
          if (bytes) setProgreso(Math.min(1, loaded / bytes));
        };

        const documento = await tarea.promise;
        if (cancelado) return;
        const primera = await documento.getPage(1);
        const vista = primera.getViewport({ scale: 1 });
        if (cancelado) return;

        /* Pagina de arranque: la del enlace (#p=37) si la hay, y si no la
           ultima en la que se quedo este navegador. */
        let inicial = 1;
        const enUrl = /^#p=(\d+)$/.exec(window.location.hash)?.[1];
        if (enUrl) inicial = Number(enUrl);
        else {
          try {
            inicial = Number(localStorage.getItem(claveGuardado(slug))) || 1;
          } catch {
            /* Navegacion privada o almacenamiento bloqueado: se empieza en 1. */
          }
        }

        setBase({ w: vista.width, h: vista.height });
        setDoc(documento);
        setPagina(Math.min(Math.max(1, inicial), documento.numPages));
        setEstado("listo");
      } catch {
        if (!cancelado) setEstado("error");
      }
    })();

    return () => {
      cancelado = true;
      for (const el of cache.values()) el.querySelector("canvas")?.remove();
      cache.clear();
      void tarea?.destroy();
    };
  }, [pdf, slug]);

  /* --- Medida del area de lectura ----------------------------------------- */
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setArea({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Mientras el lector esta abierto, la pagina de debajo no se desplaza. */
  useEffect(() => {
    const raiz = document.documentElement;
    const antes = raiz.style.overflow;
    raiz.style.overflow = "hidden";
    return () => {
      raiz.style.overflow = antes;
    };
  }, []);

  /* --- Pliego visible ------------------------------------------------------ */
  const doble = total > 1 && area.w >= 900 && area.w > area.h * 1.15;

  const paginas = useMemo(() => {
    if (!total) return [];
    if (!doble) return [pagina];
    if (pagina === 1) return [1];
    const inicio = pagina % 2 === 0 ? pagina : pagina - 1;
    return inicio + 1 <= total ? [inicio, inicio + 1] : [inicio];
  }, [doble, pagina, total]);

  /* Escala de ajuste: la pagina (o el pliego) entera dentro del area. Con
     doble pagina se calcula siempre para dos, tambien en la portada sola,
     para que el tamano no salte al pasar del primer pliego al segundo. */
  const escala = useMemo(() => {
    if (!base || !area.w || !area.h) return 0;
    const columnas = doble ? 2 : 1;
    const ajuste = Math.min(
      (area.w - MARGEN * 2) / (base.w * columnas),
      (area.h - MARGEN * 2) / base.h,
    );
    return Math.max(0.1, ajuste) * zoom;
  }, [area, base, doble, zoom]);

  const siguienteDe = useCallback(
    (p: number) => (doble ? (p === 1 ? 2 : (p % 2 === 0 ? p : p - 1) + 2) : p + 1),
    [doble],
  );
  const anteriorDe = useCallback(
    (p: number) => (doble ? Math.max(1, (p % 2 === 0 ? p : p - 1) - 2) : p - 1),
    [doble],
  );

  const irA = useCallback(
    (p: number) => {
      if (!total) return;
      setPagina(Math.min(Math.max(1, p), total));
      areaRef.current?.scrollTo({ top: 0, left: 0 });
    },
    [total],
  );

  const siguiente = useCallback(() => irA(siguienteDe(pagina)), [irA, siguienteDe, pagina]);
  const anterior = useCallback(() => irA(anteriorDe(pagina)), [irA, anteriorDe, pagina]);
  const hayAnterior = paginas[0] > 1;
  const haySiguiente = (paginas.at(-1) ?? total) < total;

  /* --- Pintado ------------------------------------------------------------ */
  const pintar = useCallback(
    async (n: number, s: number) => {
      const clave = `${n}@${s.toFixed(4)}`;
      const cache = cacheRef.current;
      const guardada = cache.get(clave);
      if (guardada) {
        /* Al final de la cola: es la usada mas recientemente. */
        cache.delete(clave);
        cache.set(clave, guardada);
        return guardada;
      }
      const pdfjs = pdfjsRef.current;
      if (!doc || !pdfjs) return null;

      const page = await doc.getPage(n);
      const vista = page.getViewport({ scale: s });
      let densidad = Math.min(window.devicePixelRatio || 1, 2);
      if (vista.width * vista.height * densidad ** 2 > PIXELES_MAX) {
        densidad = Math.sqrt(PIXELES_MAX / (vista.width * vista.height));
      }

      const hoja = document.createElement("div");
      hoja.className = "pagina-pdf";
      hoja.style.width = `${Math.floor(vista.width)}px`;
      hoja.style.height = `${Math.floor(vista.height)}px`;
      hoja.style.setProperty("--total-scale-factor", String(s));

      const lienzo = document.createElement("canvas");
      lienzo.width = Math.floor(vista.width * densidad);
      lienzo.height = Math.floor(vista.height * densidad);
      lienzo.setAttribute("aria-hidden", "true");
      hoja.append(lienzo);

      await page.render({
        canvas: lienzo,
        viewport: vista,
        transform: densidad === 1 ? undefined : [densidad, 0, 0, densidad, 0, 0],
      }).promise;

      /* La capa de texto se monta despues del dibujo y sin esperarla: la
         pagina ya se puede ver mientras el texto se coloca encima. */
      const capa = document.createElement("div");
      capa.className = "textLayer";
      hoja.append(capa);
      void new pdfjs.TextLayer({
        textContentSource: page.streamTextContent(),
        container: capa,
        viewport: vista,
      })
        .render()
        .catch(() => {});

      cache.set(clave, hoja);
      while (cache.size > CACHE_MAX) {
        const [vieja, el] = cache.entries().next().value!;
        el.querySelector("canvas")?.remove();
        cache.delete(vieja);
      }
      return hoja;
    },
    [doc],
  );

  useEffect(() => {
    if (!doc || !escala || paginas.length === 0) return;
    const turno = ++turnoRef.current;

    (async () => {
      try {
        await Promise.all(
          paginas.map(async (n, i) => {
            const hoja = await pintar(n, escala);
            const slot = slotsRef.current[i];
            if (hoja && slot && turno === turnoRef.current) slot.replaceChildren(hoja);
          }),
        );
        /* Adelanto: el pliego siguiente y el anterior, uno tras otro para no
           competir con lo que se esta viendo. */
        const vecinas: number[] = [];
        const sig = siguienteDe(paginas[0]);
        const ant = anteriorDe(paginas[0]);
        for (const p of [sig, sig + (doble ? 1 : 0), ant, ant + (doble && ant > 1 ? 1 : 0)]) {
          if (p >= 1 && p <= doc.numPages && !paginas.includes(p) && !vecinas.includes(p)) {
            vecinas.push(p);
          }
        }
        for (const p of vecinas) {
          if (turno !== turnoRef.current) return;
          await pintar(p, escala);
        }
      } catch {
        /* Un pintado cancelado al cerrar el lector no es un error. */
      }
    })();
  }, [doc, escala, paginas, pintar, siguienteDe, anteriorDe, doble]);

  /* --- Recordar la pagina ------------------------------------------------- */
  useEffect(() => {
    if (estado !== "listo") return;
    try {
      localStorage.setItem(claveGuardado(slug), String(pagina));
    } catch {
      /* Sin almacenamiento simplemente no se recuerda. */
    }
    window.history.replaceState(null, "", `#p=${pagina}`);
  }, [estado, pagina, slug]);

  /* --- Teclado ------------------------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.closest("input, select, textarea")) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      if (e.key === "Escape") {
        router.push(ficha);
        return;
      }
      if (e.key === "+" || e.key === "=") {
        setNivelZoom((z) => Math.min(z + 1, ZOOMS.length - 1));
        return;
      }
      if (e.key === "-") {
        setNivelZoom((z) => Math.max(z - 1, 0));
        return;
      }
      /* Ampliada, las flechas mueven por la pagina como cualquier scroll. */
      const ampliada = nivelZoom > 0;
      if (e.key === "PageDown" || (!ampliada && e.key === "ArrowRight")) {
        e.preventDefault();
        siguiente();
      } else if (e.key === "PageUp" || (!ampliada && e.key === "ArrowLeft")) {
        e.preventDefault();
        anterior();
      } else if (e.key === "Home") {
        e.preventDefault();
        irA(1);
      } else if (e.key === "End") {
        e.preventDefault();
        irA(total);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anterior, siguiente, irA, total, nivelZoom, router, ficha]);

  /* --- Gesto de pasar pagina ---------------------------------------------- */
  const alTocar = (e: React.PointerEvent) => {
    toqueRef.current =
      e.pointerType === "touch" && nivelZoom === 0 ? { x: e.clientX, y: e.clientY } : null;
  };
  const alSoltar = (e: React.PointerEvent) => {
    const inicio = toqueRef.current;
    toqueRef.current = null;
    if (!inicio) return;
    const dx = e.clientX - inicio.x;
    const dy = e.clientY - inicio.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) siguiente();
    else anterior();
  };

  const confirmarArrastre = () => {
    if (arrastre !== null) irA(arrastre);
    setArrastre(null);
  };

  const anuncio =
    paginas.length === 2
      ? `Páginas ${paginas[0]} y ${paginas[1]} de ${total}`
      : `Página ${paginas[0] ?? 1} de ${total}`;
  const anchoHoja = base ? Math.floor(base.w * escala) : 0;
  const altoHoja = base ? Math.floor(base.h * escala) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Lector: ${titulo}`}
      className="lector-pdf fixed inset-0 z-70 flex flex-col bg-bone text-charcoal"
    >
      {/* --- Barra superior ---------------------------------------------- */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-surface px-2 sm:gap-4 sm:px-4">
        <Link
          href={ficha}
          className="meta flex h-11 shrink-0 items-center gap-2 rounded px-3 text-charcoal transition-colors hover:bg-bone"
        >
          <span aria-hidden="true" className="relative block h-3.5 w-3.5">
            <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-charcoal" />
            <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-charcoal" />
          </span>
          <span className="hidden sm:inline">Cerrar</span>
          <span className="sr-only sm:hidden">Cerrar el lector</span>
        </Link>

        <div className="min-w-0 flex-1 text-center">
          <p className="title-display truncate text-base sm:text-lg">{titulo}</p>
          <p className="meta hidden truncate text-muted sm:block">{firma}</p>
        </div>

        <div className="flex shrink-0 items-center" role="group" aria-label="Zoom">
          <button
            type="button"
            onClick={() => setNivelZoom((z) => Math.max(z - 1, 0))}
            disabled={nivelZoom === 0}
            aria-label="Alejar"
            className="flex h-11 w-11 items-center justify-center rounded text-lg transition-colors hover:bg-bone disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <span aria-hidden="true">−</span>
          </button>
          <button
            type="button"
            onClick={() => setNivelZoom(0)}
            className="meta hidden h-11 min-w-14 items-center justify-center rounded px-1 transition-colors hover:bg-bone sm:flex"
            aria-label={`Zoom al ${Math.round(zoom * 100)} %. Ajustar a la pantalla`}
          >
            {Math.round(zoom * 100)} %
          </button>
          <button
            type="button"
            onClick={() => setNivelZoom((z) => Math.min(z + 1, ZOOMS.length - 1))}
            disabled={nivelZoom === ZOOMS.length - 1}
            aria-label="Acercar"
            className="flex h-11 w-11 items-center justify-center rounded text-lg transition-colors hover:bg-bone disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>

        <a
          href={pdf}
          download
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded transition-colors hover:bg-bone"
          aria-label="Descargar el PDF"
        >
          <svg aria-hidden="true" viewBox="0 0 256 256" className="h-[1.1rem] w-[1.1rem]">
            <path
              fill="currentColor"
              d="M224 144v64a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-64a8 8 0 0 1 16 0v56h160v-56a8 8 0 0 1 16 0Zm-101.66 5.66a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0-11.32-11.32L136 124.69V32a8 8 0 0 0-16 0v92.69l-26.34-26.35a8 8 0 0 0-11.32 11.32Z"
            />
          </svg>
        </a>
      </header>

      {/* --- Area de lectura --------------------------------------------- */}
      <div
        ref={areaRef}
        onPointerDown={alTocar}
        onPointerUp={alSoltar}
        onPointerCancel={() => (toqueRef.current = null)}
        className={`relative min-h-0 flex-1 bg-line ${
          nivelZoom > 0 ? "overflow-auto" : "overflow-hidden touch-pan-y"
        }`}
      >
        {estado === "cargando" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
            <p className="meta text-muted">Abriendo el libro</p>
            <div
              role="progressbar"
              aria-label="Carga del libro"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progreso * 100)}
              className="h-px w-48 overflow-hidden bg-surface"
            >
              <div
                className="h-full w-full origin-left bg-charcoal transition-transform duration-200"
                style={{ transform: `scaleX(${progreso})` }}
              />
            </div>
          </div>
        ) : null}

        {estado === "error" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="title-display text-2xl">No se pudo abrir el lector</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Este navegador no logró mostrar el libro aquí. Puedes abrirlo con
              el visor de tu dispositivo o descargarlo.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={pdf}
                className="inline-flex min-h-11 items-center rounded-md bg-charcoal px-5 text-sm text-white transition-opacity hover:opacity-85"
              >
                Abrir el PDF
              </a>
              <a
                href={pdf}
                download
                className="inline-flex min-h-11 items-center rounded-md border border-line bg-surface px-5 text-sm transition-colors hover:border-charcoal"
              >
                Descargar
              </a>
            </div>
          </div>
        ) : null}

        {estado === "listo" ? (
          <div
            className="flex min-h-full w-max min-w-full items-center justify-center"
            style={{ padding: MARGEN }}
          >
            <div className="flex border border-line bg-surface">
              {paginas.map((n, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    slotsRef.current[i] = el;
                  }}
                  className={`relative bg-surface ${i === 1 ? "border-l border-line" : ""}`}
                  style={{ width: anchoHoja, height: altoHoja }}
                  aria-label={`Página ${n}`}
                  role="region"
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Flechas laterales en pantallas grandes; en el telefono se pasa con
            el dedo o con la barra de abajo. */}
        {estado === "listo" && nivelZoom === 0 ? (
          <>
            <button
              type="button"
              onClick={anterior}
              disabled={!hayAnterior}
              aria-label="Página anterior"
              className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md border border-line bg-surface transition-colors hover:border-charcoal disabled:invisible md:flex"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              onClick={siguiente}
              disabled={!haySiguiente}
              aria-label="Página siguiente"
              className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md border border-line bg-surface transition-colors hover:border-charcoal disabled:invisible md:flex"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </>
        ) : null}
      </div>

      {/* --- Barra inferior ---------------------------------------------- */}
      <footer className="flex h-16 shrink-0 items-center gap-2 border-t border-line bg-surface px-2 sm:gap-4 sm:px-4">
        <button
          type="button"
          onClick={anterior}
          disabled={!hayAnterior}
          aria-label="Página anterior"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded transition-colors hover:bg-bone disabled:opacity-35 disabled:hover:bg-transparent"
        >
          <span aria-hidden="true">&larr;</span>
        </button>

        <form
          className="meta flex shrink-0 items-center gap-2 text-muted"
          onSubmit={(e) => {
            e.preventDefault();
            const campo = new FormData(e.currentTarget).get("pagina");
            const n = Number(campo);
            if (Number.isFinite(n)) irA(n);
          }}
        >
          <label htmlFor="lector-pagina" className="hidden sm:inline">
            Página
          </label>
          <input
            key={pagina}
            id="lector-pagina"
            name="pagina"
            type="number"
            inputMode="numeric"
            min={1}
            max={total || undefined}
            defaultValue={pagina}
            aria-label="Ir a la página"
            className="h-9 w-14 rounded border border-line bg-bone text-center font-mono text-sm text-charcoal [appearance:textfield] focus-visible:border-charcoal [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span>de {total || "…"}</span>
        </form>

        <input
          type="range"
          min={1}
          max={Math.max(total, 1)}
          value={arrastre ?? pagina}
          disabled={!total}
          onChange={(e) => setArrastre(Number(e.target.value))}
          onPointerUp={confirmarArrastre}
          onKeyUp={confirmarArrastre}
          onBlur={confirmarArrastre}
          aria-label="Avance por el libro"
          aria-valuetext={`Página ${arrastre ?? pagina} de ${total}`}
          className="mx-1 h-11 min-w-0 flex-1 cursor-pointer accent-charcoal"
        />

        <button
          type="button"
          onClick={siguiente}
          disabled={!haySiguiente}
          aria-label="Página siguiente"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded transition-colors hover:bg-bone disabled:opacity-35 disabled:hover:bg-transparent"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </footer>

      <p aria-live="polite" className="sr-only">
        {estado === "listo" ? anuncio : ""}
      </p>
    </div>
  );
}
