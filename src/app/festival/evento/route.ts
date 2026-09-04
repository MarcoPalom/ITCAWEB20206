/**
 * El evento de una funcion, en el formato que entienden los calendarios.
 *
 * Se sirve como archivo y no se arma en el navegador a proposito. Un .ics
 * fabricado con Blob o con data: se descarga bien en escritorio, pero en el
 * telefono -que es justo donde hace falta- Safari lo trata como una descarga
 * anonima y no siempre ofrece anadirlo al calendario. Con una direccion de
 * verdad y su Content-Type, iOS abre la hoja de Calendario y Android manda al
 * calendario que tenga puesto.
 *
 * La ruta no consulta el programa: recibe la funcion ya resuelta en la
 * direccion. Asi no arrastra el volcado -213KB- a una peticion que solo tiene
 * que escribir doce lineas de texto, y la pagina que ya tiene el dato no
 * necesita repetir la busqueda aqui.
 */

/** Lo que iCalendar obliga a escapar dentro de un valor de texto. */
function escapar(texto: string): string {
  return texto
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Parte la linea a 75 octetos, como pide el formato.
 *
 * No es una formalidad: hay calendarios que descartan el evento entero al
 * encontrar una linea mas larga, y un nombre como "Grupo de Danza Folklorica
 * Mextli de Nuevo Laredo..." se pasa de sobra. Se mide en octetos y no en
 * caracteres porque los acentos ocupan dos, y se corta contando los bytes de
 * cada caracter para no partir uno por la mitad.
 */
function plegar(linea: string): string {
  const cortes: string[] = [];
  let actual = "";
  let octetos = 0;

  for (const caracter of linea) {
    const suyos = new TextEncoder().encode(caracter).length;
    /* 74 y no 75: la continuacion entra con un espacio delante, que cuenta. */
    if (octetos + suyos > 74) {
      cortes.push(actual);
      actual = "";
      octetos = 0;
    }
    actual += caracter;
    octetos += suyos;
  }
  cortes.push(actual);

  return cortes.join("\r\n ");
}

/** "2026-10-02" -> "20261002". Vacio si no tiene la forma esperada. */
function soloDigitos(fecha: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha.replace(/-/g, "") : "";
}

/**
 * El dia siguiente, que es donde acaba un evento de dia completo: en iCalendar
 * el DTEND de un VALUE=DATE no se incluye, asi que una funcion del 5 al 8
 * termina el 9.
 *
 * Recibe y devuelve la forma compacta -"20261008"-, que es la que ya circula
 * por aqui. Construirle un ISO a base de concatenar cadenas es lo que hacia
 * antes y por eso reventaba: "20261008T00:00:00Z" no es una fecha valida.
 */
function diaSiguiente(compacta: string): string {
  const anio = Number(compacta.slice(0, 4));
  const mes = Number(compacta.slice(4, 6));
  const dia = Number(compacta.slice(6, 8));
  const d = new Date(Date.UTC(anio, mes - 1, dia + 1));
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

export function GET(peticion: Request) {
  const parametros = new URL(peticion.url).searchParams;

  const titulo = (parametros.get("titulo") ?? "").slice(0, 200).trim();
  const sede = (parametros.get("sede") ?? "").slice(0, 200).trim();
  const municipio = (parametros.get("municipio") ?? "").slice(0, 120).trim();
  const desde = soloDigitos(parametros.get("desde") ?? "");
  const hasta = soloDigitos(parametros.get("hasta") ?? "");
  const hora = parametros.get("hora") ?? "";

  if (!titulo || !desde) {
    return new Response("Faltan el titulo o la fecha.", { status: 400 });
  }

  /* La hora va flotante: sin Z y sin zona declarada, que en iCalendar significa
     "a esa hora local, donde sea que se abra". Es lo que corresponde a un
     festival al que se asiste en persona, y ademas evita el enredo de que
     Tamaulipas no tiene una sola hora: la franja fronteriza -Matamoros,
     Reynosa, Nuevo Laredo- sigue el horario de verano de Estados Unidos y el
     resto del estado no, asi que en octubre no coinciden. Declarar una zona
     obligaria a acertar municipio por municipio para no citar a nadie con una
     hora de diferencia. */
  const conHora = /^\d{2}:\d{2}$/.test(hora);
  const cuando = conHora
    ? [`DTSTART:${desde}T${hora.replace(":", "")}00`]
    : [
        `DTSTART;VALUE=DATE:${desde}`,
        `DTEND;VALUE=DATE:${diaSiguiente(hasta || desde)}`,
      ];

  /* No se declara cuanto dura porque el programa no lo dice. Inventar una
     duracion seria escribir en el calendario del visitante una hora de fin que
     nadie ha anunciado. */

  const donde = [sede, municipio, "Tamaulipas"].filter(Boolean).join(", ");

  /* El identificador sale del propio contenido y no de un azar: asi, quien
     anada dos veces la misma funcion se encuentra con que su calendario la
     reconoce y la actualiza en vez de duplicarla. */
  const identidad = `${desde}-${hora}-${titulo}-${municipio}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);

  const lineas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ITCA//FICSM 2026//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${identidad}@itcadigital.mx`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    ...cuando,
    plegar(`SUMMARY:${escapar(titulo)}`),
    ...(donde ? [plegar(`LOCATION:${escapar(donde)}`)] : []),
    plegar(
      `DESCRIPTION:${escapar(
        "Festival Internacional Cultural Seno Mexicano 2026. Programa completo en https://itcadigital.mx",
      )}`,
    ),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  /* Los saltos son CRLF porque el formato lo exige; con \n solo, hay
     calendarios de escritorio que no leen el archivo. */
  const archivo = lineas.join("\r\n") + "\r\n";

  return new Response(archivo, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="ficsm-${identidad.slice(0, 60) || "evento"}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
