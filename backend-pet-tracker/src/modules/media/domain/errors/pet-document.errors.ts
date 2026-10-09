export class PetDocumentNotFoundError extends Error {
  constructor() {
    super('Pet document not found');
    this.name = 'PetDocumentNotFoundError';
  }
}

export class PetDocumentNotUploadedError extends Error {
  constructor() {
    super('Pet document file not found in storage');
    this.name = 'PetDocumentNotUploadedError';
  }
}

export class PetDocumentTooLargeError extends Error {
  constructor() {
    super('Pet document file exceeds the size limit');
    this.name = 'PetDocumentTooLargeError';
  }
}
