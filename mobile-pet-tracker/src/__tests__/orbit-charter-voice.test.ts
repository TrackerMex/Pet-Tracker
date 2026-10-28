const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');
const { join } = jest.requireActual<typeof import('path')>('path');

describe('#221 R4: la carta nombra a Orbit en el punto 7', () => {
  it('#221 R4: la carta nombra a Orbit en el punto 7', () => {
    const charter = readFileSync(join(process.cwd(), '..', 'docs', 'ui-guidelines.md'), 'utf8');
    const start = charter.indexOf('**7. Voz de ');
    const end = charter.indexOf('## Checklist de autocrítica');
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const block = charter.slice(start, end);

    // (i) encabezado
    expect(block.split('**7. Voz de Orbit: guardián sereno.**').length - 1).toBe(1);
    expect(block.split('**7. Voz de Pingo').length - 1).toBe(0);

    // (ii) párrafo de apertura y párrafo de la nota, literales
    const opening = `**7. Voz de Orbit: guardián sereno.** Decidido por el humano el 2026-10-07
(D1 de la feature #153): la mascota habla con la voz B, «guardián sereno».
El humano decidió el 2026-10-26 (feature #221) que la mascota se llama
**Orbit** (antes Pingo). Rige todo texto que la app pone en boca de Orbit
(bocadillos, estados vacíos, celebraciones, avisos); el resto del copy sigue el
punto 6 sin más. Cada frase nueva de Orbit entra con su clave en los dos
idiomas, como cualquier otra copy.`;
    const note = `Hasta la feature #225, los identificadores, los testID, las claves del
catálogo y los assets conservan el prefijo pingo (PingoFloat,
welcome.pingoGreeting, pingo-wave.webp), y las enmiendas fechadas de esta carta
conservan «Pingo» como historia.`;
    expect(block.split(opening).length - 1).toBe(1);
    expect(block.split(note).length - 1).toBe(1);

    // (iii) viñetas
    expect(block).toContain('- **Persona:** Orbit habla');
    expect(block).toContain('Una alerta de Orbit dice qué pasa y qué hacer.');

    // (iv) solo las dos «Pingo» de la nota de la decisión
    expect(block.match(/\bPingo\b/g)).toHaveLength(2);

    // (v) sin encabezado de enmienda propio
    expect(charter).not.toContain('## Enmienda #221');

    // (vi) la casilla del humano existe, firmada o no
    const spec = readFileSync(
      join(process.cwd(), '..', 'specs', 'mobile-orbit-rename-copy', 'requirements.md'),
      'utf8',
    );
    expect(spec.match(/^- \[[ xX]\] Enmienda de la carta \(punto 7\)/gm)).toHaveLength(1);
  });
});
