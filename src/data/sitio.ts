/**
 * Dominio real de produccion. De aqui salen las URLs absolutas de canonical,
 * sitemap, robots.txt y Open Graph -sin esto, resolverlas en desarrollo daria
 * localhost, y si algo quedara cacheado o exportado desde ahi las etiquetas
 * se quedarian con esa URL.
 *
 * Vive en su propio modulo y no en layout.tsx: Next.js solo reconoce un
 * puñado de exports en un archivo de ruta (default, metadata,
 * generateMetadata, generateStaticParams...), y una constante mas ahi
 * cuenta como export invalido de ruta.
 */
export const SITIO = "https://itcadigital.mx";

/**
 * Identificador de medicion de Google Analytics 4: el "G-XXXXXXXXXX" que da la
 * propiedad en el panel. Cadena vacia significa sin analitica, y sin analitica
 * no se carga absolutamente nada: ni script, ni peticion, ni cookie.
 *
 * Vive aqui y no en una variable de entorno por dos motivos. No es un secreto:
 * cualquier NEXT_PUBLIC_ se incrusta en el HTML al compilar, de modo que el
 * identificador queda a la vista en el codigo fuente de todas formas. Y sobre
 * todo por operativa: .gitignore excluye .env*, asi que un valor escrito ahi
 * habria que volver a ponerlo a mano en el VPS y cualquier despliegue limpio se
 * quedaria sin medicion sin avisar de nada.
 */
export const ANALITICA = "G-DS6XJBFCQ6";
