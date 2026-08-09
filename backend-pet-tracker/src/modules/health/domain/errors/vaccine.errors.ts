export class VaccineCatalogNotFoundError extends Error {
  constructor(id: string) {
    super(`Vaccine catalog entry not found: ${id}`);
    this.name = 'VaccineCatalogNotFoundError';
  }
}

export class VaccineSpeciesMismatchError extends Error {
  constructor() {
    super('Vaccine species does not match pet species');
    this.name = 'VaccineSpeciesMismatchError';
  }
}

export class VaccineNotFoundError extends Error {
  constructor(id: string) {
    super(`Vaccine not found: ${id}`);
    this.name = 'VaccineNotFoundError';
  }
}
