import { Request, Response } from 'express';

import {  Controller} from '@/contracts';

export function expressRouteAdapter(controller: Controller) {
  return async (req: Request, res: Response) => {
    const httpRequest = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    };
    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.headers) res.set(httpResponse.headers);
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  };
}
