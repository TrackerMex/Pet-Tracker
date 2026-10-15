# Ronda 3 de #171: resuelve los 7 conflictos de `git merge origin/main` (788d1f89).
# Lo escribe el leader y lo ejecuta Codex desde la raiz del worktree:
#   python3 -I progress/merge_ronda3_mobile-celebrations-and-living-empty.py .
# Exige conflictStyle=merge (sin bloque base). Cada fichero debe tener exactamente
# los hunks indicados; si no, aborta sin escribir ese fichero. El resultado lo
# verifica el handoff con `git write-tree --prefix=...` contra el arbol medido en
# la spike del leader.
import re, sys
root = sys.argv[1]
PAT = re.compile(r'^<<<<<<< [^\n]*\n(.*?)^=======\n(.*?)^>>>>>>> [^\n]*\n', re.S | re.M)
CLOSE = '  });\n});\n'

def resolve(path, n, fn):
    p = f'{root}/{path}'
    t = open(p, encoding='utf-8').read()
    assert '|||||||' not in t, path + ': conflictStyle diff3; usa -c merge.conflictStyle=merge'
    found = PAT.findall(t)
    assert len(found) == n, f'{path}: {len(found)} hunks, esperaba {n}'
    i = [0]
    def rep(m):
        r = fn(i[0], m.group(1), m.group(2)); i[0] += 1; return r
    t2 = PAT.sub(rep, t)
    assert '<<<<<<<' not in t2 and '>>>>>>>' not in t2 and '\n=======\n' not in t2, path
    open(p, 'w', encoding='utf-8').write(t2)
    print(path, 'hunks', n)

M = 'mobile-pet-tracker/src/'

resolve('docs/ui-guidelines.md', 1, lambda i, o, th: th + '\n' + o)

def classnames(i, o, th):
    if i == 0:
        return o + th.splitlines(True)[1]
    if i == 1:
        return "    ).toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4 + 1 - 1); // #41 R9: geofences-link; #168 R3, R8, R6; #170 R16; #171 R3: ready-done\n"
    if i == 2:
        return ("    expect(food.match(/style=\\{CONTINUOUS_CORNER\\}/g)).toHaveLength(1);\n"
                "    expect(count(/style=\\{CONTINUOUS_CORNER\\}/g)).toBe(31 + 1 + 4 + 1 - 1); // #41 R9: geofences-link; #168; #170 R8: alert-detail-map; #171 R3: ready-done\n"
                + o.splitlines(True)[2] +
                "    expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1 - 1 - 1); // #147 R4: meal-time-edit y add-meal-time-button; #105 R11; #168 R5: PetPills pasa a huecos pastel; #171 R3\n")
    if i == 3:
        return "    expect(accentSoftCount).toBe(16 + 2 + 1 - 1 - 1); // #147 R4, #105 R11; #168 R5: PetPills pasa a huecos pastel; #171 R3\n"
    if i == 4:
        return th + "    [join('components', 'celebration.tsx')]: 1, // #171 R14\n"
    return ("    expect(count(/border-lip-gray/g)).toBe(4 + 1 + 1); // #170 R16; #171 R14\n"
            "    expect(count(/\\bborder-b-6\\b/g)).toBe(4 + 1 + 1); // #170 R16; #171 R14\n")
resolve(M + '__tests__/consistency-classnames.test.ts', 6, classnames)

resolve(M + '__tests__/design-drift.test.ts', 1, lambda i, o, th: th + CLOSE + o)

resolve(M + 'providers/__tests__/language-provider.test.tsx', 1, lambda i, o, th:
    "        + 4 // #171 R12\n        - 1 // #159 R2\n        + 1 // #167 R5\n        + 2 // #169 R9\n        + 7, // #170 R1\n")

def motion_test(i, o, th):
    if i == 0:
        t = th.splitlines(True)
        return ''.join(t[:3]) + o + t[3]
    return th + CLOSE + '\n' + o
resolve(M + 'theme/__tests__/motion.test.ts', 2, motion_test)

resolve(M + 'theme/motion.ts', 1, lambda i, o, th: th + '\n' + o)

resolve('specs/mobile-ui-language/design.md', 1, lambda i, o, th: th + '\n' + o)
