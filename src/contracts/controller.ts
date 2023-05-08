import { User } from "@/domain/user"
import { Request, Response } from "express";

export interface Controller<Input, Output> {
  handle(params?: Input): Output
}

export type RequestType = {
  request: Request;
  response: Response;
}
export type CreateSession = Controller<RequestType, Promise<string>>
