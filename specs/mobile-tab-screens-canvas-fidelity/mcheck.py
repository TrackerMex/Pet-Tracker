"""Corre las medidas M1-M51 de requirements.md §1 desde el cwd (mobile-pet-tracker/).

Uso: python3 ../specs/mobile-tab-screens-canvas-fidelity/mcheck.py base|cierre [M1 M2 ...]
Sin ids corre todas. Imprime una línea por medida y sale con el número de discrepancias.
Fichero del leader para el handoff de #173: no se edita.
"""
import os, re, subprocess, sys

col = {'base': 3, 'cierre': 4}[sys.argv[1]]
ids = set(sys.argv[2:])
req = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'requirements.md')
bad = 0
for line in open(req, encoding='utf-8'):
    m = re.match(r'^\| *(M\d+) \| `(.*)` \| ([^|]+) \| ([^|]+) \|', line)
    if not m or (ids and m.group(1) not in ids):
        continue
    want = m.group(col).strip()
    out = subprocess.run(['bash', '-c', m.group(2).replace('\\|', '|')], capture_output=True, text=True).stdout.strip()
    ok = out == want
    bad += not ok
    print(f"{m.group(1)}\t{out}\t{'ok' if ok else 'DIFF ' + sys.argv[1] + '=' + want}")
sys.exit(bad)
