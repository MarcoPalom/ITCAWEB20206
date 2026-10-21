"""
Convierte un concentrado de beneficiarios en Excel al JSON que importa
scripts/beneficiarios.mjs.

Formato que se espera del Excel (el que manda el area de convocatorias):
una pestana por convocatoria, con el nombre de la convocatoria como nombre
de la pestana, y en la primera columna el nombre del beneficiario o
representante, con una fila de encabezado. Las demas columnas -el nombre del
proyecto, por ejemplo- se ignoran: el padron solo publica el nombre.

Solo usa la biblioteca estandar, para que corra igual en el servidor que en
cualquier equipo sin instalar nada.

Uso:
    python scripts/excel-beneficiarios.py concentrado.xlsx 2026 > lote.json
"""

import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
REL = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"


def leer(ruta):
    with zipfile.ZipFile(ruta) as z:
        compartidas = []
        if "xl/sharedStrings.xml" in z.namelist():
            raiz = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in raiz.findall("m:si", NS):
                compartidas.append("".join(t.text or "" for t in si.iter(f"{{{NS['m']}}}t")))

        libro = ET.fromstring(z.read("xl/workbook.xml"))
        rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        destino = {r.get("Id"): r.get("Target") for r in rels}

        for hoja in libro.find("m:sheets", NS):
            nombre = hoja.get("name").strip()
            ruta_hoja = "xl/" + destino[hoja.get(REL)].lstrip("/").removeprefix("xl/")
            datos = ET.fromstring(z.read(ruta_hoja))
            nombres = []
            for fila in datos.iter(f"{{{NS['m']}}}row"):
                celda = next(
                    (c for c in fila.findall("m:c", NS) if re.match(r"A\d+$", c.get("r", ""))),
                    None,
                )
                if celda is None:
                    continue
                tipo = celda.get("t")
                if tipo == "s":
                    valor = compartidas[int(celda.find("m:v", NS).text)]
                elif tipo == "inlineStr":
                    valor = "".join(t.text or "" for t in celda.iter(f"{{{NS['m']}}}t"))
                else:
                    v = celda.find("m:v", NS)
                    valor = v.text if v is not None else ""
                valor = re.sub(r"\s+", " ", valor or "").strip()
                if valor:
                    nombres.append(valor)
            # La primera fila es el encabezado ("Beneficiario / representante").
            yield nombre, nombres[1:]


def main():
    if len(sys.argv) != 3:
        sys.exit("Uso: python scripts/excel-beneficiarios.py concentrado.xlsx AÑO")
    ruta, anio = sys.argv[1], int(sys.argv[2])
    lote = {
        "convocatorias": [
            {"nombre": nombre, "anio": anio, "beneficiarios": nombres}
            for nombre, nombres in leer(ruta)
            if nombres
        ]
    }
    sys.stdout.reconfigure(encoding="utf-8")
    json.dump(lote, sys.stdout, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
