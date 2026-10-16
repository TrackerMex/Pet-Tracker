#!/usr/bin/env python3
"""Resuelve los 9 conflictos de `git merge origin/main --no-commit` en #178.

Se ejecuta desde la raiz del worktree. Aborta (exit 1) si un fichero no trae los
marcadores esperados: no adivina. Escrito por el leader; el handoff es
progress/handoff_mobile-routine-canvas-fidelity_merge.md.
"""
import re
import subprocess
import sys

HUNK = re.compile(r"<<<<<<< HEAD\n(.*?)=======\n(.*?)>>>>>>> origin/main\n", re.S)


def die(msg):
    print("RESOLVE-FAIL: " + msg)
    sys.exit(1)


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write(path, text):
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def hunks(text, expected, path):
    found = list(HUNK.finditer(text))
    if len(found) != expected:
        die(f"{path}: {len(found)} conflictos, esperaba {expected}")
    return found


def show(rev, path):
    return subprocess.check_output(["git", "show", f"{rev}:{path}"]).decode("utf-8").split("\n")


def block(lines, start):
    """Bloque `describe(...)` completo: desde la linea que empieza por `start` hasta el primer `});` en columna 0."""
    i = next((k for k, line in enumerate(lines) if line.startswith(start)), None)
    if i is None:
        die(f"no hay {start!r}")
    j = next(k for k in range(i, len(lines)) if lines[k] == "});")
    return lines[i : j + 1]


def marker_lines(lines):
    starts = [i for i, line in enumerate(lines) if line.startswith("<<<<<<<")]
    ends = [i for i, line in enumerate(lines) if line.startswith(">>>>>>>")]
    return starts, ends


def close_after(lines, idx):
    return next(k for k in range(idx, len(lines)) if lines[k] == "});")


# 1. global.css: se conservan los dos radios de #178; --text-22 de #179 ya esta fuera del conflicto.
p = "mobile-pet-tracker/src/theme/global.css"
s = read(p)
hunks(s, 1, p)
write(p, HUNK.sub(lambda m: m.group(1), s))

# 2. global-css.test.ts: los dos describes #178 R1 y #179 R1 completos, cada uno de su padre.
p = "mobile-pet-tracker/src/theme/__tests__/global-css.test.ts"
lines = read(p).split("\n")
starts, ends = marker_lines(lines)
if len(starts) != 2 or len(ends) != 2:
    die(f"{p}: marcadores {starts} {ends}")
new = (
    block(show("HEAD", p), "describe('#178 R1:")
    + [""]
    + block(show("origin/main", p), "describe('#179 R1:")
)
lines[starts[0] : close_after(lines, ends[1]) + 1] = new
write(p, "\n".join(lines))

# 3. language-provider.test.tsx: las tres deltas de main suman a la de #178.
p = "mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx"
s = read(p)
hunks(s, 1, p)
a = "<<<<<<< HEAD\n        + 2, // #178 R3\n=======\n        + 5 // #179 R3\n        - 2 // #179 R5\n        + 9, // #183 R1\n>>>>>>> origin/main\n"
b = "        + 2 // #178 R3\n        + 5 // #179 R3\n        - 2 // #179 R5\n        + 9, // #183 R1\n"
if a not in s:
    die(f"{p}: el conflicto no es el esperado")
write(p, s.replace(a, b))

# 4. alerts-canvas-fidelity.test.ts: inventario de tracking-title, orden alfabetico.
p = "mobile-pet-tracker/src/__tests__/alerts-canvas-fidelity.test.ts"
s = read(p)
hunks(s, 1, p)
a = (
    "<<<<<<< HEAD\n        'screens/reminders/index.tsx', // #178 R4\n=======\n"
    "        'screens/meal-schedule/index.tsx', // #179 R4\n"
    "        'screens/meals-history/index.tsx', // #179 R9\n>>>>>>> origin/main\n"
)
b = (
    "        'screens/meal-schedule/index.tsx', // #179 R4\n"
    "        'screens/meals-history/index.tsx', // #179 R9\n"
    "        'screens/reminders/index.tsx', // #178 R4\n"
)
if a not in s:
    die(f"{p}: el conflicto no es el esperado")
write(p, s.replace(a, b))

# 5. consistency-classnames.test.ts: los recuentos suman las deltas de #178 y de #179.
p = "mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts"
s = read(p)
ms = hunks(s, 4, p)
repl = []
repl.append(
    "    ).toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4 + 1 - 1 - 7 + 1 + 1 + 2 + 2); "
    "// #179 R5, R10, R12; #178 R6, R12; #41 R9: geofences-link; #168 R3, R8, R6; #170 R16; "
    "#171 R3: ready-done; #173 R10: ProfileTile\n"
)
main2 = ms[1].group(2).split("\n")
l1 = (
    "    expect(count(/style=\\{CONTINUOUS_CORNER\\}/g)).toBe(31 + 1 + 4 + 1 - 1 - 7 + 1 + 1 + 2 + 2); "
    "// #179 R5, R10, R12; #178 R6, R12; #41 R9: geofences-link; #168; #170 R8: alert-detail-map; "
    "#171 R3: ready-done; #173 R10: ProfileTile\n"
)
l2 = main2[1] + "\n"
l3 = (
    "    expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1); "
    "// #179 R6, R7, R11; #178 R5, R10, R12; "
    + main2[2].split("// ", 1)[1].replace("#179 R6, R7, R11; ", "")
    + "\n"
)
repl.append(l1 + l2 + l3)
repl.append(
    "    expect(accentSoftCount).toBe(16 + 2 + 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1 - 1); "
    "// #179 R6, R7, R11; #178 R5, R10, R12; #147 R4, #105 R11; #168 R5: PetPills pasa a huecos pastel; "
    "#172 R14: forgot-lock-tile pasa a bg-accent; #171 R3; #173 R6\n"
    "    expect(reminders.match(/bg-accent-soft/g)).toBeNull(); // #178 R5, R10\n"
)
main4 = ms[3].group(2).split("\n")
repl.append(
    main4[0]
    + "\n"
    + "    expect(count(/border-black\\/25/g)).toBe(19 + 1 + 1 - 1 - 1 - 1 + 1 + 1 - 1); "
    "// #178 R10: el chip seleccionado lleva labio (carta §13); #179 R5, R7; "
    "#172 R14: forgot-lock-tile (Enmienda #172); #171 R3: ready-map // #171 R14 // #173 R5; "
    "#175 R7: docs-upload\n"
)
out = s
for m, r in reversed(list(zip(ms, repl))):
    out = out[: m.start()] + r + out[m.end() :]
write(p, out)

# 6. ui-language.test.ts: titulo de main (51, decorativo), calculo de #178.
p = "mobile-pet-tracker/src/__tests__/ui-language.test.ts"
s = read(p)
m = hunks(s, 1, p)[0]
head = m.group(1).split("\n")
r = "  it('resuelve las 51 ocurrencias normativas', () => {\n" + head[1] + "\n"
write(p, s[: m.start()] + r + s[m.end() :])

# 7. design-drift.test.ts: los cuatro describes completos, cada uno de su padre.
p = "mobile-pet-tracker/src/__tests__/design-drift.test.ts"
lines = read(p).split("\n")
starts, ends = marker_lines(lines)
if len(starts) != 3 or len(ends) != 3:
    die(f"{p}: marcadores {starts} {ends}")
ours = show("HEAD", p)
theirs = show("origin/main", p)
r2 = block(ours, "describe('#178 R2:") + [""] + block(theirs, "describe('#179 R2:")
r13 = block(ours, "describe('#178 R13:") + [""] + block(theirs, "describe('#179 R13:")
e2 = close_after(lines, ends[1])
e3 = close_after(lines, ends[2])
lines = lines[: starts[0]] + r2 + lines[e2 + 1 : starts[2]] + r13 + lines[e3 + 1 :]
text = "\n".join(lines)

# 7b. Candado de radios de #178 R13: #179 comparte rounded-14 (mismo token --radius-14).
old = (
    "    expect(sourceFiles(sourceRoot).filter((file) =>\n"
    "      file !== join(sourceRoot, featureFiles[0])\n"
    "      && !/\\.test\\.tsx?$/.test(file)\n"
    "      && /\\brounded-(?:14|16|22)\\b/.test(readFileSync(file, 'utf8')),\n"
    "    ).map((file) => file.slice(sourceRoot.length + 1))).toEqual([]);\n"
)
new = (
    "    const outsideReminders = (pattern: RegExp) => sourceFiles(sourceRoot).filter((file) =>\n"
    "      file !== join(sourceRoot, featureFiles[0])\n"
    "      && !/\\.test\\.tsx?$/.test(file)\n"
    "      && pattern.test(readFileSync(file, 'utf8')),\n"
    "    ).map((file) => file.slice(sourceRoot.length + 1));\n"
    "    expect(outsideReminders(/\\brounded-(?:16|22)\\b/)).toEqual([]);\n"
    "    expect(outsideReminders(/\\brounded-14\\b/)).toEqual([\n"
    "      join('screens', 'meal-schedule', 'index.tsx'), // #179 R13 comparte rounded-14\n"
    "      join('screens', 'meals-history', 'index.tsx'), // #179 R13 comparte rounded-14\n"
    "    ]);\n"
)
if text.count(old) != 1:
    die(f"{p}: el candado de radios de #178 no esta tal cual")
write(p, text.replace(old, new))

# 8. docs/ui-guidelines.md: se conservan las dos lineas de cada conflicto (#178 y luego #179).
p = "docs/ui-guidelines.md"
s = read(p)
hunks(s, 2, p)
write(p, HUNK.sub(lambda m: m.group(1) + m.group(2), s))

# 9. specs/mobile-ui-language/design.md: §2.32 y §2.33 de main; la seccion de #178 pasa a §2.34.
p = "specs/mobile-ui-language/design.md"
s = read(p)
m = hunks(s, 1, p)[0]
mine = m.group(1)
old_h = "### §2.32 — Añadidos por #178"
if old_h not in mine:
    die(f"{p}: no hay el encabezado de #178")
res = m.group(2).rstrip("\n") + "\n\n" + mine.replace(old_h, "### §2.34 — Añadidos por #178")
write(p, s[: m.start()] + res + s[m.end() :])

print("RESOLVE-OK")
