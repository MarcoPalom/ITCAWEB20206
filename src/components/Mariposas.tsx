/**
 * Mariposas monarca revoloteando sobre el campo de girasoles, visibles solo
 * en el tramo central del ciclo diurno.
 *
 * La silueta se define una unica vez como <symbol> y cada mariposa la
 * referencia con <use>: un solo dibujo en memoria por muchas instancias.
 *
 * El aleteo no anima las alas por separado. Escala el conjunto en el eje X,
 * que es como se ve un aleteo en perspectiva desde lejos: a este tamano
 * resulta convincente y cuesta una sola transformacion compuesta en GPU.
 */

type Mariposa = {
  x: string;
  y: string;
  tam: string;
  ruta: string;
  dur: string;
  retardo: string;
  aleteo: string;
};

const MARIPOSAS: Mariposa[] = [
  { x: "12%", y: "72%", tam: "34px", ruta: "revoloteo-a", dur: "17s", retardo: "0s", aleteo: "0.42s" },
  { x: "31%", y: "84%", tam: "26px", ruta: "revoloteo-b", dur: "21s", retardo: "-4s", aleteo: "0.36s" },
  { x: "54%", y: "68%", tam: "30px", ruta: "revoloteo-c", dur: "19s", retardo: "-9s", aleteo: "0.47s" },
  { x: "68%", y: "88%", tam: "22px", ruta: "revoloteo-a", dur: "23s", retardo: "-13s", aleteo: "0.39s" },
  { x: "83%", y: "75%", tam: "32px", ruta: "revoloteo-b", dur: "18s", retardo: "-6s", aleteo: "0.44s" },
  { x: "44%", y: "91%", tam: "24px", ruta: "revoloteo-c", dur: "25s", retardo: "-17s", aleteo: "0.33s" },
];

export default function Mariposas() {
  return (
    <div className="mariposas absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Definicion unica de la silueta */}
      <svg width="0" height="0" className="absolute">
        <symbol id="monarca" viewBox="0 0 64 56">
          <g stroke="#17110a" strokeWidth="2.4" strokeLinejoin="round">
            <path d="M31 18C26 8 16 2 9 6 3 10 3 20 9 25c7 5 18 2 22 1z" fill="#d9641b" />
            <path d="M33 18c5-10 15-16 22-12 6 4 6 14 0 19-7 5-18 2-22 1z" fill="#d9641b" />
            <path d="M31 27c-7-1-17 3-18 10-1 7 7 11 13 7 4-3 6-10 5-14z" fill="#e07f22" />
            <path d="M33 27c7-1 17 3 18 10 1 7-7 11-13 7-4-3-6-10-5-14z" fill="#e07f22" />
          </g>
          <g stroke="#17110a" strokeWidth="1.1" fill="none" opacity="0.85">
            <path d="M28 24 14 12M27 26 12 20M30 34 18 32M31 37 20 39" />
            <path d="M36 24 50 12M37 26 52 20M34 34 46 32M33 37 44 39" />
          </g>
          <g fill="#fdf6ea">
            <circle cx="9" cy="9" r="1.1" />
            <circle cx="6" cy="15" r="1.1" />
            <circle cx="7" cy="22" r="1.1" />
            <circle cx="55" cy="9" r="1.1" />
            <circle cx="58" cy="15" r="1.1" />
            <circle cx="57" cy="22" r="1.1" />
            <circle cx="17" cy="42" r="1" />
            <circle cx="47" cy="42" r="1" />
          </g>
          <ellipse cx="32" cy="30" rx="2.2" ry="12" fill="#17110a" />
          <circle cx="32" cy="17" r="2.6" fill="#17110a" />
          <g stroke="#17110a" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M31 15C29 10 26 7 23 6M33 15c2-5 5-8 8-9" />
          </g>
        </symbol>
      </svg>

      {MARIPOSAS.map((m, i) => (
        <div
          key={i}
          className="mariposa"
          style={
            {
              "--x": m.x,
              "--y": m.y,
              "--tam": m.tam,
              "--ruta": m.ruta,
              "--dur": m.dur,
              "--retardo": m.retardo,
              "--aleteo": m.aleteo,
            } as React.CSSProperties
          }
        >
          <svg className="mariposa-ala" viewBox="0 0 64 56">
            <use href="#monarca" />
          </svg>
        </div>
      ))}
    </div>
  );
}
