import Image from "next/image";

import { OFICIAL, UNIDADES, type Unidad } from "@/data/itca";
import Reveal from "./Reveal";

const Horario = ({ horario }: { horario: string[] }) =>
  horario.length > 0 ? (
    <ul className="mt-5 space-y-1 border-t border-line pt-4">
      {horario.map((h) => (
        <li key={h} className="font-mono text-xs leading-relaxed text-muted">
          {h}
        </li>
      ))}
    </ul>
  ) : (
    <p className="mt-5 border-t border-line pt-4 font-mono text-xs text-muted">
      Horario en la ficha oficial
    </p>
  );

const Ficha = ({ u }: { u: Unidad }) => (
  <a
    href={`${OFICIAL}/${u.slug}/`}
    target="_blank"
    rel="noopener"
    className="meta mt-5 inline-flex min-h-11 items-center text-accent transition-opacity hover:opacity-70"
  >
    Ficha del recinto
    <span className="sr-only"> {u.nombre} (se abre en otra pestaña)</span>
  </a>
);

/**
 * Unidades culturales del Instituto. Solo cuatro tienen fotografia publicada
 * en el sitio oficial: esas van en tarjeta grande con imagen y las demas en
 * tarjeta de texto, en vez de rellenar con fotos que no son del recinto.
 */
export default function Unidades() {
  const conFoto = UNIDADES.filter((u) => u.foto);
  const sinFoto = UNIDADES.filter((u) => !u.foto);

  return (
    <section id="unidades" className="scroll-mt-20 border-b border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="meta text-accent">Unidades culturales</p>
              <h2 className="title-display mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light">
                Ocho recintos abiertos
              </h2>
            </div>
            <p className="max-w-md leading-relaxed text-muted">
              Teatros, museos, una pinacoteca, una biblioteca y escuelas de arte
              que dependen del Instituto, en cuatro ciudades del Estado.
            </p>
          </div>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {conFoto.map((u, i) => (
            <Reveal as="li" key={u.slug} delay={(i % 2) * 80}>
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface">
                <div className="relative aspect-[16/9] border-b border-line bg-bone">
                  <Image
                    src={`/img/itca/unidades/${u.slug}.webp`}
                    alt={u.foto!.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover [filter:saturate(0.85)]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="meta text-muted">{u.ciudad}</p>
                  <h3 className="title-display mt-3 text-2xl leading-tight">{u.nombre}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{u.resena}</p>
                  <Horario horario={u.horario} />
                  <Ficha u={u} />
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sinFoto.map((u, i) => (
            <Reveal as="li" key={u.slug} delay={i * 80}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-surface p-7">
                <p className="meta text-muted">{u.ciudad}</p>
                <h3 className="title-display mt-3 text-xl leading-tight">{u.nombre}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{u.resena}</p>
                <Horario horario={u.horario} />
                <Ficha u={u} />
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
