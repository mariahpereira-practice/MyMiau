import type { RequestHandler } from 'express';

export type BodyValidator = (body: unknown) => string[];

export const validateBody = (validator: BodyValidator): RequestHandler => (
  req,
  res,
  next,
) => {
  const errors = validator(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      error: true,
      message: 'Dados inválidos.',
      errors,
    });
  }

  return next();
};
