import { readFileSync } from 'fs';
import { join } from 'path';

const source = (file: string) => readFileSync(join(process.cwd(), 'src', file), 'utf8');

describe('#194 R5: profile editing follows the UI charter', () => {
  it.each(['screens/edit-profile/index.tsx', 'app/edit-profile.tsx'])('#194 R5: keeps %s grep-clean', (file) => {
    const text = source(file);
    expect(text).not.toMatch(/#(?!\d{2,3} R\d)[\da-f]{3,8}\b|StyleSheet|[A-Za-z0-9_-]+-\[[^\]]+\]/i);
    expect(text).not.toMatch(/rounded-(?!card\b|xl\b|full\b|24\b|16\b)[\w-]+/);
    expect(text).not.toMatch(/text-accent(?![-\w])/);
  });

  it('#194 R5: reuses the shared field errors four times', () => {
    const text = source('screens/edit-profile/index.tsx');
    expect(text).toContain("import { FieldErrorMessage } from '../../components/field-error-message'");
    expect(text.match(/FieldErrorMessage/g)).toHaveLength(5);
    expect(text).not.toMatch(/import\s*{[^}]*\bFieldError\b[^}]*}\s*from ['"]heroui-native/);
  });

  it('#194 R5: leaves the saved zone automatic', () => {
    const text = source('screens/edit-profile/index.tsx');
    expect(text).not.toContain('timezone');
    expect(text).not.toContain('deviceTimezone');
  });
});


const document = (file: string) => readFileSync(join(process.cwd(), '..', 'docs', file), 'utf8');

describe('#194 R10: the charter documents profile editing', () => {
  it.each(['conventions.md', 'ui-guidelines.md'])('#194 R10: lists edit-profile in the A11 paragraph of %s', (file) => {
    const text = document(file);
    const a11 = text.slice(text.indexOf('Excepción nombrada (enmienda A11'));
    expect(a11.slice(0, a11.indexOf('Su'))).toContain('`edit-profile`');
  });

  it('#194 R10: records the editing rule and its human approval checkbox', () => {
    const text = document('ui-guidelines.md');
    expect(text).toContain('## Enmienda #194 — Editar perfil');
    for (const literal of ['edit-profile-link', '/edit-profile', 'userKeys.me()']) {
      expect(text).toContain(literal);
    }
    expect(text).toMatch(/- \[[ xX]\] Enmienda #194 aprobada por humano/);
  });

  it('#194 R10: records A22 and its human approval checkbox in conventions', () => {
    const text = document('conventions.md');
    expect(text).toContain('enmienda A22 de #194');
    expect(text).toMatch(/- \[[ xX]\] Enmienda A22 aprobada por humano/);
  });
});
