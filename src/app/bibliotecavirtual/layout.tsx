import SiteHeader, { type NavItem } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { COLECCIONES, librosDeColeccion } from "@/data/biblioteca";

/* El menu de la biblioteca lleva a sus propias secciones y, al final, al
   resto del sitio. */
const ITEMS: NavItem[] = [
  {
    label: "Biblioteca Virtual",
    href: "/bibliotecavirtual",
    desc: "Catálogo completo del Fondo Editorial Tamaulipas.",
  },
  ...COLECCIONES.map((c) => {
    const n = librosDeColeccion(c.slug).length;
    return {
      label: c.nombre,
      href: `/bibliotecavirtual/coleccion/${c.slug}`,
      desc: `${c.generos.join(", ")}. ${n} ${n === 1 ? "título" : "títulos"}.`,
    };
  }),
  {
    label: "Autores",
    href: "/bibliotecavirtual/autores",
    desc: "Índice de autoras y autores, con semblanza y obra.",
  },
  {
    label: "Sitio del ITCA",
    href: "/",
    desc: "Comunicados, unidades culturales y convocatorias del Instituto.",
  },
  {
    label: "Festival del Seno Mexicano",
    href: "/festival",
    desc: "Programación y sedes del festival.",
  },
];

export default function BibliotecaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader items={ITEMS} tono="oscuro" />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
