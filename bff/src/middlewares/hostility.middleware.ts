import { NextFunction, Request, Response } from 'express';

const parseLatencyMs = (value: string | undefined): number => {
  const parsed = value ? Number.parseInt(value, 10) : 3000;
  return Number.isNaN(parsed) || parsed < 0 ? 3000 : parsed;
};

const parseFailureRate = (value: string | undefined): number => {
  const parsed = value ? Number.parseFloat(value) : 0.2;
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0.2;
};

const delay = (milliseconds: number): Promise<void> => {
  return new Promise((resolve: (value: void | PromiseLike<void>) => void): void => {
    setTimeout((): void => resolve(), milliseconds);
  });
};

export const hostilityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const latencyMs = parseLatencyMs(process.env.LATENCY_MS);
  const failureRate = parseFailureRate(process.env.FAILURE_RATE);

  await delay(latencyMs);

  if (Math.random() < failureRate) {
    const status = Math.random() < 0.5 ? 500 : 503;
    res.status(status).json({ message: 'Simulated infrastructure failure' });
    return;
  }

  next();
};
