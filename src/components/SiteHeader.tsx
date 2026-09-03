"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { FESTIVAL } from "@/data/festival";

export type NavItem = {
  label: string;
  href: string;
  desc: string;
};

/** Navegacion del sitio institucional. Las paginas con secciones propias
    -como el festival- pasan las suyas por la prop `items`. */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Festival del Seno Mexicano",
    href: "/festival",
    /* Derivado de FESTIVAL y no escrito a mano: aqui vivian "primera edicion"
       y la fecha duplicada, que es justo como se desincronizan. En minusculas
       porque va dentro de la frase, no abriendola. */
    desc: `Programación y sedes de la ${FESTIVAL.edicion.toLowerCase()}, del ${FESTIVAL.fechas}.`,
  },
  {
    label: "ITCA Digital",
    href: "#itca-digital",
    desc: "Podcast, revista digital, repositorio cultural y charlas.",
  },
  {
    label: "Convocatorias",
    href: "#convocatorias",
    desc: "Premios, becas y estímulos abiertos para creadores tamaulipecos.",
  },
  {
    label: "Biblioteca Virtual",
    href: "#biblioteca",
    desc: "Acervo digital de consulta libre del Estado de Tamaulipas.",
  },
  {
    label: "Comunicados",
    href: "#comunicados",
    desc: "Blog institucional organizado por eje de acción.",
  },
  {
    label: "Redes sociales",
    href: "#redes",
    desc: "Actividad diaria del Instituto en sus canales.",
  },
];

const Marca = ({ tone = "light" }: { tone?: "light" | "dark" }) => (
  <span
    className={`title-display text-2xl ${tone === "light" ? "text-white" : "text-charcoal"}`}
  >
    ITCA
  </span>
);

export default function SiteHeader({
  items = NAV_ITEMS,
  tono = "claro",
}: {
  items?: NavItem[];
  /** "claro" sobre portada oscura, "oscuro" sobre portada clara. */
  tono?: "claro" | "oscuro";
}) {
  const sobreClaro = tono === "oscuro";
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Inicio, sitio del ITCA">
            <Marca tone={sobreClaro ? "dark" : "light"} />
          </Link>

          <button
            ref={triggerRef}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-haspopup="dialog"
            className={`meta flex h-11 items-center gap-3 transition-opacity hover:opacity-70 ${
              sobreClaro ? "text-charcoal" : "text-white"
            }`}
          >
            Menu
            <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
              <span
                className={`block h-px w-full ${sobreClaro ? "bg-charcoal" : "bg-white"}`}
              />
              <span
                className={`block h-px w-full ${sobreClaro ? "bg-charcoal" : "bg-white"}`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        inert={!open}
        className={`fixed inset-0 z-60 bg-bone transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" onClick={close} aria-label="Inicio, sitio del ITCA">
              <Marca tone="dark" />
            </Link>
            <button
              onClick={close}
              className="meta flex h-11 items-center gap-3 text-charcoal transition-opacity hover:opacity-60"
            >
              Cerrar
              <span aria-hidden="true" className="relative block h-4 w-4">
                <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-charcoal" />
                <span className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-charcoal" />
              </span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-8">
            <ul className="border-t border-line">
              {items.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={close}
                    className="group flex flex-col gap-1 py-6 transition-colors hover:text-accent sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                  >
                    <span className="title-display text-[clamp(1.75rem,4vw,2.75rem)] font-light">
                      {item.label}
                    </span>
                    <span className="max-w-sm text-sm text-muted sm:text-right">
                      {item.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="meta flex flex-col gap-2 border-t border-line py-6 text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>Instituto Tamaulipeco para la Cultura y las Artes</span>
            <span>Ciudad Victoria, Tamaulipas</span>
          </div>
        </div>
      </div>
    </>
  );
}
