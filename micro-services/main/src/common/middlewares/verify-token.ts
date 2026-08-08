import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../jwt';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { TokenVerify } from '../../interfaces';



/**
 * Middleware to extract and verify the JWT token from the request header or session.
 * Sets the currentUser property on the request object.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function.
 */
export const verify_token = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  

  // Extract token from the Authorization header or session
  let token: string | undefined = req.headers.authorization && req.headers.authorization.split(' ')[1];

  // If token is not found in headers, check session
  if (!token && req.params.token) {
    token = req.params.token;
  }

  // If token is still not found, move to the next middleware
  if (!token) {
    throw new NotAuthorizedError();
  }
// Verify the token and set currentUser on the request
  const payload = verifyToken<TokenVerify>(token)
  
  // Check if the payload is of the correct type and set currentUser accordingly
  if (isTokenVerify(payload)) {
    next();
  }else{
    throw new NotAuthorizedError();
  }

};


/**
 * Checks if the given payload is of type TokenVerify.
 * @param payload The payload to check.
 * @returns True if the payload is of type TokenVerify, false otherwise.
 */
export function isTokenVerify(payload: any): payload is TokenVerify {
  return typeof payload === 'object' && 'verify' in payload && 'data' in payload;
}


