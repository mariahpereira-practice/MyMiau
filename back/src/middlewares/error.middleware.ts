import { NextFunction, Request, Response } from 'express';

type HttpError = Error & { status?: number };

export default function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(status).json({ error: message });
}
