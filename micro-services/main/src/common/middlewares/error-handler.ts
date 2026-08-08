import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';
import * as customLogger from "../errors/logger";
import { validationResult } from 'express-validator';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    customLogger.Logger.error(`API Error: ${JSON.stringify(err.serializeErrors(), null, 2)}`);
    return res.error<Record<string,any>>({ errors: err.serializeErrors() },err.statusCode,false);
  }

  customLogger.Logger.error(`API Error ${err.name}: ${err.message}\n\tStack: ${err.stack}`);

  res.error<string>('Something went wrong',400,false);
};




// Middleware function to handle validation errors
export const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      
      if (req.isMain) {
          req.flash("errors", errors.array());
          return res.redirect("/"+req.template!);
      }
        
      return res.error<any>(errors.array(),400);
    }
    next(); // Proceed to the next middleware or route handler
};