"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";

import type { Beneficiario, Convocatoria } from "@/lib/beneficiarios";

const sinAcentos = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Lo que hay que saber de una fila antes de entregar otro apoyo. */
function Observaciones({ b }: { b: Beneficiario }) {
  const notas: { texto: string; fuerte: boolean }[] = [];
  if (b.apoyos > 1) {
    notas.push({ texto: `${b.apoyos} apoyos en esta misma convocatoria`, fuerte: true });
  }
  for (const c of b.coincidencias) {
    notas.push(
      c.tipo === "mismo"
        ? { texto: `También beneficiario en ${c.convocatoria} ${c.anio}`, fuerte: true }
        : { texto: `Nombre similar en ${c.convocatoria} ${c.anio}: ${c.nombre}`, fuerte: false },
    );
  }
  if (notas.length === 0) return <span className="text-muted">—</span>;
  return (
    <ul className="space-y-1.5">
      {notas.map((n) => (
        <li key={n.texto}>
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs leading-snug ${
              n.fuerte ? "bg-accent-bg text-accent" : "border border-line text-charcoal"
            }`}
          >
            {n.texto}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Padron consultable: busqueda por nombre en todas las convocatorias a la
 * vez, filtro por convocatoria y una vista solo con los casos a revisar.
 * La busqueda ignora acentos, mayusculas y el orden de las palabras, que es
 * como llegan escritos los nombres de un concentrado a otro.
 */
export default function TablaBeneficiarios({
  convocatorias,
  beneficiarios,
}: {
  convocatorias: Convocatoria[];
  beneficiarios: Beneficiario[];
}) {
  const [consulta, setConsulta] = useState("");
  const [convocatoria, setConvocatoria] = useState<number | null>(null);
  const [soloRevisar, setSoloRevisar] = useState(false);
  const diferida = useDeferredValue(consulta);
  const idBusqueda = useId();

  const indice = useMemo(
    () => beneficiarios.map((b) => ({ b, texto: sinAcentos(b.nombre) })),
    [beneficiarios],
  );

  const aRevisar = (b: Beneficiario) => b.apoyos > 1 || b.coincidencias.length > 0;
  const totalRevisar = beneficiarios.filter(aRevisar).length;

  const visibles = useMemo(() => {
    const terminos = sinAcentos(diferida).split(/\s+/).filter(Boolean);
    return indice
      .filter(
        ({ b, texto }) =>
          (convocatoria === null || b.convocatoriaId === convocatoria) &&
          (!soloRevisar || aRevisar(b)) &&
          terminos.every((t) => texto.includes(t)),
      )
      .map(({ b }) => b);
  }, [indice, diferida, convocatoria, soloRevisar]);

  const chip = (activo: boolean) =>
    `min-h-11 rounded-full border px-4 text-sm transition-colors ${
      activo
        ? "border-charcoal bg-charcoal text-white"
        : "border-line bg-surface text-charcoal hover:border-charcoal"
    }`;

  return (
    <div>
      <div className="rounded-lg border border-line bg-surface p-4 sm:p-6">
        <label htmlFor={idBusqueda} className="meta text-muted">
          Consultar un nombre
        </label>
        <input
          id={idBusqueda}
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Nombre o apellidos"
          autoComplete="off"
          className="mt-2 h-12 w-full rounded-md border border-line bg-bone px-4 text-base text-charcoal placeholder:text-muted focus-visible:border-charcoal"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por convocatoria">
        <button type="button" aria-pressed={convocatoria === null} onClick={() => setConvocatoria(null)} className={chip(convocatoria === null)}>
          Todas las convocatorias
        </button>
        {convocatorias.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={convocatoria === c.id}
            onClick={() => setConvocatoria(c.id)}
            className={chip(convocatoria === c.id)}
          >
            {c.nombre} {c.anio}
          </button>
        ))}
        {totalRevisar > 0 ? (
          <button
            type="button"
            aria-pressed={soloRevisar}
            onClick={() => setSoloRevisar((v) => !v)}
            className={chip(soloRevisar)}
          >
            Solo casos a revisar ({totalRevisar})
          </button>
        ) : null}
      </div>

      <p aria-live="polite" className="meta mt-8 text-muted">
        {visibles.length} {visibles.length === 1 ? "registro" : "registros"}
      </p>

      {visibles.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-line px-6 py-14 text-center">
          <p className="title-display text-2xl">Sin registros</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            {consulta
              ? "Ese nombre no aparece en el padrón con los filtros elegidos. Prueba solo con un nombre y un apellido."
              : "No hay beneficiarios con los filtros elegidos."}
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Beneficiarios de convocatorias del ITCA</caption>
            <thead className="border-b border-line bg-bone">
              <tr>
                <th scope="col" className="meta px-5 py-3 font-normal text-muted">Beneficiario / representante</th>
                <th scope="col" className="meta px-5 py-3 font-normal text-muted">Convocatoria</th>
                <th scope="col" className="meta px-5 py-3 font-normal text-muted">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((b) => (
                <tr key={b.id} className="border-b border-line align-top last:border-b-0">
                  <th scope="row" className="px-5 py-4 font-normal text-charcoal">{b.nombre}</th>
                  <td className="px-5 py-4 text-muted">
                    {b.convocatoria}
                    <span className="block font-mono text-xs">{b.anio}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Observaciones b={b} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
