import { Router } from 'express';
import { expressRouteAdapter } from '../adapters/route-adapter';
import { makeCreateChartController } from '@/infra/factories/make-create-session-controller';

export default function (router: Router): void {
  router.post('session', expressRouteAdapter(makeCreateChartController()));
}