import { HttpResponse } from "@/contracts";

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});