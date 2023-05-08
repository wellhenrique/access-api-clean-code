export class InvalidDomainParamError extends Error {
  constructor(field: string) {
    super(`Field: ${field}`);
    this.name = "InvalidDomainParamError";
  }
}