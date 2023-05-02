export interface Repository<Input, Output> {
  handle(params?: Input): Output
}