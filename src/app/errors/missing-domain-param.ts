export class MissingDomainParamError extends Error {
  constructor(field: string) {
    super(`Field: ${field}`);
    this.name = "MissingDomainParamError";
  }
}
