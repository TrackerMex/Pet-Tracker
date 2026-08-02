import {
  ClaimDeviceSchema,
  toDeviceIdentifier,
} from './claim-device.dto';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';

describe('R4: ClaimDeviceSchema exige petId UUID y exactamente un identificador', () => {
  it.each(['esn', 'imei', 'serialNumber', 'activationCode'])(
    'acepta petId + %s como unico identificador',
    (key) => {
      const result = ClaimDeviceSchema.safeParse({
        petId: PET_ID,
        [key]: 'SIM-001',
      });

      expect(result.success).toBe(true);
    },
  );

  it('recorta espacios del identificador', () => {
    const result = ClaimDeviceSchema.safeParse({
      petId: PET_ID,
      esn: '  SIM-001  ',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.esn).toBe('SIM-001');
    }
  });

  it('rechaza petId ausente y petId no-UUID', () => {
    expect(ClaimDeviceSchema.safeParse({ esn: 'SIM-001' }).success).toBe(false);
    expect(
      ClaimDeviceSchema.safeParse({ petId: 'not-a-uuid', esn: 'SIM-001' })
        .success,
    ).toBe(false);
  });

  it('rechaza cero identificadores presentes', () => {
    expect(ClaimDeviceSchema.safeParse({ petId: PET_ID }).success).toBe(false);
  });

  it('rechaza dos identificadores presentes', () => {
    const result = ClaimDeviceSchema.safeParse({
      petId: PET_ID,
      esn: 'SIM-001',
      imei: '123456789012345',
    });

    expect(result.success).toBe(false);
  });

  it('rechaza identificador vacio, no-string o de mas de 64 caracteres', () => {
    expect(
      ClaimDeviceSchema.safeParse({ petId: PET_ID, esn: '   ' }).success,
    ).toBe(false);
    expect(
      ClaimDeviceSchema.safeParse({ petId: PET_ID, esn: 12345 }).success,
    ).toBe(false);
    expect(
      ClaimDeviceSchema.safeParse({ petId: PET_ID, esn: 'x'.repeat(65) })
        .success,
    ).toBe(false);
  });
});

describe('R4: toDeviceIdentifier extrae el unico identificador presente', () => {
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
