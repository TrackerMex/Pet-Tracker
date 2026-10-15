"""Corre las medidas P1-P8, S1-S7 y M1-M38 de requirements.md §1 desde el cwd (mobile-pet-tracker/).

Uso: python3 ../specs/mobile-alerts-canvas-fidelity/mcheck.py base|cierre [M1 M2 ...]
Sin ids corre todas. Imprime una línea por medida y sale con el número de discrepancias.
`base` = valores medidos por el leader en H0; `cierre` = valores «Al cerrar» (H0 + delta en las filas «H0»).
M37 y M38 solo existen en `cierre` y miden contra H0 = el commit `docs(progress): #174 handoff a Codex (H0)`.
Fichero del leader para el handoff de #174: no se edita.
"""
import re, subprocess, sys

G = 'src/theme/global.css'
SCR = 'src/screens/alerts/index.tsx'
CAT = 'src/i18n/catalog.ts'
META = 'src/utils/alert-meta.ts'
UIG = '../docs/ui-guidelines.md'
UIL = '../specs/mobile-ui-language/design.md'
GF = "grep -cF --"

# id: (orden, base en H0, cierre)
T = {
    'P1': (f"{GF} \"--font-extrabold: 'Inter-ExtraBold';\" {G}", '1', '1'),
    'P2': (f"{GF} '--text-13: 13px;' {G}", '1', '1'),
    'P3': (f"{GF} '--text-26: 26px;' {G}", '1', '1'),
    'P4': ("test -e src/__tests__/profile-canvas-fidelity.test.ts; echo $?", '0', '0'),
    'P5': ("grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' ../docs/conventions.md", '1', '1'),
    'P6': (f"grep -cF '**Excepción nombrada (fidelidad al canvas, 2026-10-13)**' {UIG}", '1', '1'),
    'P7': (f"grep -cF 'Tamaños de letra fuera de la escala de Tailwind' {UIG}", '1', '1'),
    'P8': ("test ! -e .expo/types/router.d.ts; echo $?", '0', '0'),
    'S1': (f"{GF} '--text-15: 15px;' {G}", '1', '1'),
    'S2': (f"{GF} '--tracking-title: -0.02em;' {G}", '0', '1'),
    'S3': (f"grep -cF '## Enmienda de fidelidad al canvas (2026-10-13)' {UIG}", '0', '1'),
    'S4': (f"{GF} \"- Títulos de pantalla: título en contenido y cabecera nativa con \\`title: ''\\` (Enmienda de fidelidad al canvas).\" {UIG}", '0', '1'),
    'S5': (f"grep -cF 'la superficie siempre acompaña a un icono de reicon-react-native y a un texto.' {UIG}", '0', '1'),
    'S6': (f"grep -cF 'Tracking fuera de la escala de Tailwind' {UIG}", '0', '1'),
    'S7': (f"{GF} '`--text-15: 15px`' {UIG}", '0', '1'),
    'M1': (f"{GF} '--text-15: 15px;' {G}", '1', '1'),
    'M2': (f"{GF} '--radius-10: 10px;' {G}", '0', '1'),
    'M3': (f"{GF} '--tracking-title: -0.02em;' {G}", '0', '1'),
    'M4': (f"{GF} '--tracking-caps: 0.06em;' {G}", '0', '1'),
    'M5': (f"{GF} \"'alerts.dayAgo'\" {CAT}", '0', '2'),
    'M6': (f"{GF} \"'alerts.daysAgo': '{{{{days}}}} d ago',\" {CAT}", '1', '0'),
    'M7': (f"{GF} \"'alerts.daysAgo': 'Hace {{{{days}}}} d',\" {CAT}", '1', '0'),
    'M8': (f"{GF} \"'alerts.daysAgo': '{{{{days}}}} days ago',\" {CAT}", '0', '1'),
    'M9': (f"{GF} \"'alerts.daysAgo': 'Hace {{{{days}}}} días',\" {CAT}", '0', '1'),
    'M10': ("grep -cF \"title: t('alerts.title')\" src/app/_layout.tsx", '1', '0'),
    'M11': (f"grep -cF \"t('alerts.title')\" {SCR}", '0', '1'),
    'M12': (f"grep -cF 'testID=\"alerts-title\"' {SCR}", '0', '1'),
    'M13': (f"grep -cF '<PopIn' {SCR}", '0', '1'),
    'M14': (f"grep -cF 'padding: 24,' {SCR}", '1', '0'),
    'M15': (f"grep -cF 'paddingHorizontal: 20,' {SCR}", '0', '1'),
    'M16': (f"grep -cF 'className=\"gap-4\"' {SCR}", '1', '0'),
    'M17': (f"grep -cF 'min-h-20' {SCR}", '1', '0'),
    'M18': (f"grep -cF 'size={{20}}' {SCR}", '1', '0'),
    'M19': (f"grep -cF 'size={{22}}' {SCR}", '0', '1'),
    'M20': (f"grep -cF 'disc:' {META}", '0', '3'),
    'M21': (f"grep -cF \"surface: 'bg-danger-soft',\" {META}", '1', '1'),
    'M22': (f"grep -cF 'border-b-5' {SCR}", '0', '1'),
    'M23': (f"grep -cF 'text-2xs' {SCR}", '1', '0'),
    'M24': (f"grep -cF '<HomeEntrance' {SCR}", '0', '1'),
    'M25': (f"grep -cF 'TABULAR_NUMS}}' {SCR}", '1', '1'),
    'M26': (f"grep -c '^## Enmienda #' {UIG}", '9', '10'),
    'M27': (f"grep -c '^### §2\\.' {UIL}", '29', '30'),
    'M28': ("grep -c '^## Enmienda' ../specs/mobile-alerts-center/requirements.md", '4', '5'),
    'M29': ("grep -c '^## Enmienda' ../specs/mobile-reminders-alerts-to-stack/requirements.md", '1', '2'),
    'M30': ("grep -c '^## Enmienda' ../specs/mobile-alerts-grouped-and-detail-map/requirements.md", '3', '4'),
    'M31': ("grep -c '^## Enmienda' ../specs/mobile-alert-detail-screen/requirements.md", '1', '2'),
    'M32': ("grep -c '^## Enmienda' ../specs/mobile-chunky-cta/requirements.md", '1', '2'),
    'M33': (f"grep -cF 'confirmar alerta).' {UIG}", '1', '0'),
    'M34': (f"grep -cF 'Títulos de pantalla: header del stack cuando exista, no Text suelto.' {UIG}", '1', '0'),
    'M35': (f"grep -cF 'categoría: la superficie siempre acompaña a un emoji y a un texto.' {UIG}", '1', '0'),
    'M36': (f"grep -cF 'Enmienda #174' {UIG}", '0', '2'),
    'M37': ("git diff --quiet <H0> -- src/screens/alert-detail/; echo $?", None, '0'),
    'M38': ("git diff --stat <H0> -- ../backend-pet-tracker/ ../infra/", None, ''),
}

mode = sys.argv[1]
ids = set(sys.argv[2:])
col = {'base': 1, 'cierre': 2}[mode]
h0 = subprocess.run(['git', 'log', '-1', '--format=%H', '--grep=^docs(progress): #174 handoff a Codex (H0)$'],
                    capture_output=True, text=True).stdout.strip()
bad = 0
for k, row in T.items():
    if ids and k not in ids:
        continue
    want = row[col]
    if want is None:
        continue
    cmd = row[0].replace('<H0>', h0 or 'HEAD')
    out = subprocess.run(['bash', '-c', cmd], capture_output=True, text=True).stdout.strip()
    ok = out == want
    bad += not ok
    print(f"{k}\t{out}\t{'ok' if ok else 'DIFF ' + mode + '=' + repr(want)}")
sys.exit(bad)
