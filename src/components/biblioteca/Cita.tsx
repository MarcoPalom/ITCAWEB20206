"use client";

import { useState } from "react";

/**
 * Referencia lista para copiar, en formato APA: es el que piden casi todas
 * las escuelas y universidades del Estado, que son quienes mas citan este
 * fondo. El texto se ve completo aunque el portapapeles no este disponible.
 */
export default function Cita({ texto }: { texto: string }) {
  const [copiada, setCopiada] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiada(true);
      setTimeout(() => setCopiada(false), 2400);
    } catch {
      /* Sin permiso de portapapeles el texto sigue ahi para seleccionarlo. */
    }
  };

  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <p className="text-sm leading-relaxed text-charcoal [overflow-wrap:anywhere]">{texto}</p>
      <button
        type="button"
        onClick={copiar}
        className="meta mt-5 inline-flex min-h-11 items-center rounded border border-line px-4 text-charcoal transition-colors hover:border-charcoal active:scale-[0.98]"
      >
        {copiada ? "Copiada" : "Copiar referencia"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copiada ? "Referencia copiada al portapapeles" : ""}
      </span>
    </div>
  );
}
