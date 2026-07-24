import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import lotesRoutes from './routes/lotes.routes';
import { hostilityMiddleware } from './middlewares/hostility.middleware';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', hostilityMiddleware);
app.use('/api/v1/lotes', lotesRoutes);

app.use((req: Request, res: Response): Response => {
  return res.status(404).json({ message: 'Not Found' });
});

export default app;
