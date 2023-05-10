export interface HttpResponseHeaderInjector {
  inject(data: any): void;
}

export interface HttpRequest {
  body?: any;
  headers?: any;
  query?: any;
  params?: any;
}

export type HttpResponse = {
  statusCode: number;
  body: any;
  headers?: any;
};

export interface Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
