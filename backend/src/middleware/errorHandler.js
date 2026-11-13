import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  console.error('[MODÉRA Error]', {
    path: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: formattedErrors,
    });
  }

  // Handle Prisma Known Request Errors
  if (err.code) {
    switch (err.code) {
      case 'P2002': // Unique constraint failed
        return res.status(409).json({
          success: false,
          message: `A record with this ${err.meta?.target ? err.meta.target : 'unique attribute'} already exists.`,
        });
      case 'P2025': // Record not found
        return res.status(404).json({
          success: false,
          message: 'Requested record was not found.',
        });
      case 'P2003': // Foreign key constraint failure
        return res.status(400).json({
          success: false,
          message: 'Invalid relational reference.',
        });
    }
  }

  // Handle JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication token has expired. Please log in again.',
    });
  }

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

