export interface UseCase<Input, Output> {
  exec(params?: Input): Output
}
