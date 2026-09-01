import MarcoFestival from "@/components/festival/MarcoFestival";

/**
 * Marco comun de todas las rutas del festival.
 *
 * Ojo con la transicion: el <ViewTransition> NO va aqui. Envolviendo children
 * desde el layout, el componente nunca se desmonta al cambiar de ruta -solo le
 * cambian los hijos- y React lo trata como una actualizacion, no como una
 * entrada y una salida. Las animaciones enter y exit no llegan a dispararse.
 * Por eso vive dentro de cada page, que es donde monta y desmonta de verdad.
 */
export default function FestivalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="identidad-festival flex min-h-full flex-1 flex-col">
      <MarcoFestival>{children}</MarcoFestival>
    </div>
  );
}
