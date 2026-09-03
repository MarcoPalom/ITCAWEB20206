"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { marcarOrigenClic } from "./IslaNav";

/**
 * Link normal que ademas marca el origen del barrido circular en el punto
 * donde se hizo clic, igual que hacen las pastillas de IslaNav. Hace falta
 * para cualquier navegacion interna que no pase por la isla -las fichas del
 * bentobox de municipios, el boton fijo de volver-: sin esto el circulo nace
 * en el ultimo punto que marco la isla, que no tiene relacion con lo que se
 * acaba de pulsar.
 */
export default function EnlaceBarrido(props: ComponentProps<typeof Link>) {
  return <Link {...props} onClick={marcarOrigenClic} />;
}
