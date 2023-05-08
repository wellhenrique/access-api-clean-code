export class UserDisabledError extends Error {
  constructor() {
    super();
    this.name = "UserDisabledError";
  }
}
