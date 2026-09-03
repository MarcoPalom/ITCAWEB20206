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
