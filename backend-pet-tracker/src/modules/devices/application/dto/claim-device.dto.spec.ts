import { ClaimDeviceSchema, toDeviceIdentifier } from './claim-device.dto';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';

describe('R1 (claim-activation-code-only #26): ClaimDeviceSchema exige petId UUID y activationCode', () => {
  it('acepta petId + activationCode (R1a)', () => {
    const result = ClaimDeviceSchema.safeParse({
      petId: PET_ID,
      activationCode: 'ACT-001',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(Object.keys(result.data).sort()).toEqual([
        'activationCode',
        'petId',
      ]);
    }
  });

  it.each(['esn', 'imei', 'serialNumber'])(
    'rechaza petId + %s sin activationCode (R1b)',
    (key) => {
      const result = ClaimDeviceSchema.safeParse({
        petId: PET_ID,
        [key]: 'SIM-001',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) => issue.path[0] === 'activationCode',
          ),
        ).toBe(true);
      }
    },
  );

  it('recorta espacios del identificador', () => {
    const result = ClaimDeviceSchema.safeParse({
      petId: PET_ID,
      activationCode: '  ACT-001  ',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.activationCode).toBe('ACT-001');
    }
  });

  it('rechaza petId ausente y petId no-UUID', () => {
    expect(
      ClaimDeviceSchema.safeParse({ activationCode: 'ACT-001' }).success,
    ).toBe(false);
    expect(
      ClaimDeviceSchema.safeParse({
        petId: 'not-a-uuid',
        activationCode: 'ACT-001',
      }).success,
    ).toBe(false);
  });

  it('rechaza body sin activationCode (R1b #26)', () => {
    expect(ClaimDeviceSchema.safeParse({ petId: PET_ID }).success).toBe(false);
  });

  it('ignora imei/esn/serialNumber si vienen junto al activationCode (R1c #26)', () => {
    const result = ClaimDeviceSchema.safeParse({
      petId: PET_ID,
      activationCode: 'ACT-001',
      esn: 'SIM-001',
      imei: '123456789012345',
      serialNumber: 'SER-1',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect('imei' in result.data).toBe(false);
      expect('esn' in result.data).toBe(false);
      expect('serialNumber' in result.data).toBe(false);
    }
  });

  it('rechaza identificador vacio, no-string o de mas de 64 caracteres', () => {
    expect(
      ClaimDeviceSchema.safeParse({ petId: PET_ID, activationCode: '   ' })
        .success,
    ).toBe(false);
    expect(
      ClaimDeviceSchema.safeParse({ petId: PET_ID, activationCode: 12345 })
        .success,
    ).toBe(false);
    expect(
      ClaimDeviceSchema.safeParse({
        petId: PET_ID,
        activationCode: 'x'.repeat(65),
      }).success,
    ).toBe(false);
  });
});

describe('R3 (claim-activation-code-only #26): toDeviceIdentifier devuelve siempre activationCode', () => {
  it('devuelve el campo y el valor del identificador', () => {
    const dto = ClaimDeviceSchema.parse({
      petId: PET_ID,
      activationCode: 'ACT-001',
    });

    expect(toDeviceIdentifier(dto)).toEqual({
      field: 'activationCode',
      value: 'ACT-001',
    });
  });
});
