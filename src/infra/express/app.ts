import cors from 'cors';
import express from 'express';

import { setupRoutes } from '@/infra/express/setup-routes';

const app = express();
app.use(cors({ exposedHeaders: 'new_access_token' }));
setupRoutes(app).catch(console.error);

export { app };
