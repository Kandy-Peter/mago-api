import { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import jsonResponse from '../helpers/jsonResponse';

export const handleValidationErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isCelebrateError(err)) {
    const details = err.details.get('body')?.details || [];
    const message = "Validation failed: " + details.map((error) => error.message).join(", ");
    return jsonResponse({
      res,
      status: 400,
      message,
    });
  }
  next(err);
};
