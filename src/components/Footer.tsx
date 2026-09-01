import Reveal from "./Reveal";

const INSTITUCIONAL = [
  "Acerca del ITCA",
  "Directorio",
  "Renta de espacios",
  "Trabaja con nosotros",
];

const AYUDA = ["Preguntas frecuentes", "Contacto", "Transparencia", "Aviso de privacidad"];

const REDES = [
  { nombre: "Facebook", href: "#" },
  { nombre: "Instagram", href: "#" },
  { nombre: "YouTube", href: "#" },
  { nombre: "Spotify", href: "#" },
];

export default function Footer() {
  return (
    <footer id="redes" className="mt-auto bg-bone">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-1 gap-12 border-b border-line pb-14 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <p className="title-display text-2xl">ITCA</p>
              <p className="mt-4 max-w-xs leading-relaxed text-muted">
                Instituto Tamaulipeco para la Cultura y las Artes
              </p>
              <address className="mt-6 not-italic text-sm leading-relaxed text-muted">
                Calzada General Luis Caballero 297
                <br />
                Ciudad Victoria, Tamaulipas
                <br />
                <a
                  href="mailto:contacto@itca.gob.mx"
                  className="text-accent transition-opacity hover:opacity-70"
                >
                  contacto@itca.gob.mx
                </a>
              </address>
            </div>

            <div>
              <p className="meta text-muted">Institucional</p>
              <ul className="mt-5 space-y-3">
                {INSTITUCIONAL.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-charcoal transition-colors hover:text-accent"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="meta text-muted">Ayuda</p>
              <ul className="mt-5 space-y-3">
                {AYUDA.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-charcoal transition-colors hover:text-accent"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-6">
            {REDES.map((red) => (
              <li key={red.nombre}>
                <a
                  href={red.href}
                  className="meta text-muted transition-colors hover:text-charcoal"
                >
                  {red.nombre}
                </a>
              </li>
            ))}
          </ul>
          <p className="meta text-muted">
            &copy; {new Date().getFullYear()} Gobierno de Tamaulipas
          </p>
        </div>
      </div>
    </footer>
  );
}
