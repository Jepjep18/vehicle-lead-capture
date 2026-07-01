import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/api-error.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  void _next;

  if (error instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
