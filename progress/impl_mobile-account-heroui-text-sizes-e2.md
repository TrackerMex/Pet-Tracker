# impl: mobile-account-heroui-text-sizes (e2)

Commit feat: e40d54b1  feat(#187 R3): ack del detalle de alerta con Text plano (R3)
(precedido por 7bd23dbb, commit del humano con los pisos 226/180)

Cambio: mobile-pet-tracker/src/screens/alert-detail/index.tsx, ack: Button.Label text-17 -> Text plano. Diff verificado: solo esa linea.

Tests (uno a la vez, con el cambio aplicado):
- heroui-text-size-merge.test.ts: Tests: 25 passed, 25 total
- screens/alert-detail/index.test.tsx: Tests: 127 passed, 127 total
- alert-detail-canvas-fidelity.test.ts: Tests: 20 passed, 20 total
- design-drift.test.ts: Tests: 113 passed, 113 total
router.d.ts ausente; typecheck exit 0; expo lint --no-cache limpio (log vacio).

Desviaciones: los pisos del it 2 de R1 (HeroUI 227->226, className 181->180) los edito y commiteo el humano (7bd23dbb) tras denegaciones del classifier; ficheros 28 y Card 42 sin tocar. Sin push, sin init.sh.
