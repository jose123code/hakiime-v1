import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../jwt';
import { Session } from 'express-session'; // Import the Session type from express-session
import { LicensePayload, SessionPayload, TokenVerify, UserPayload } from '../../interfaces';
import { isTokenVerify } from './verify-token';



// Extend the Request interface to include currentUser property
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | SessionPayload | LicensePayload;
      isMain?: boolean;
      layout?: string;
      template?: string;
      flash: any;
    }

  }
}

/**
 * Middleware to extract and verify the JWT token from the request header or session.
 * Sets the currentUser property on the request object.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function.
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== "/auth/login" &&
    req.path !== "/auth/register" &&
    !req.path.match(/^\/auth1/) &&
    !req.path.match(/\./)) {

    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path == "/account") {
    req.session.returnTo = req.path;
  }
  
  // Extract token from the Authorization header or session
  let token: string | undefined = req.headers.authorization && req.headers.authorization.split(' ')[1];

  // If token is not found in headers, check session
  if (!token && (req.session as Session & { jwt?: string })?.jwt) {
    token = (req.session as Session & { jwt?: string }).jwt;
  }

  // If token is not found in headers, check session
  if (!token && req.params.token) {
    token = req.params.token;
  }


  // If token is still not found, move to the next middleware
  if (!token) {
    return next();
  }
  // Verify the token and set currentUser on the request
  const payload = verifyToken<UserPayload | SessionPayload | TokenVerify>(token)

  // Check if the payload is of the correct type and set currentUser accordingly
  if (isUserPayload(payload) || isSessionPayload(payload) || isLicensePayload(payload)) {
    req.currentUser = payload;
  }

  // Check if the payload is of the correct type and set currentUser accordingly
  if (isTokenVerify(payload)) {
    req.currentUser = payload.data;
  }

  if (token.startsWith('HKMIVYS-')) {
    req.currentUser = {
      auth: token
    };
  }

  next();
};




/**
 * Checks if the given payload is of type UserPayload.
 * @param payload The payload to check.
 * @returns True if the payload is of type UserPayload, false otherwise.
 */
export function isUserPayload(payload: any): payload is UserPayload {
  return typeof payload === 'object' && 'id' in payload && 'email' in payload;
}

/**
 * Checks if the given payload is of type LicensePayload.
 * @param payload The payload to check.
 * @returns True if the payload is of type LicensePayload, false otherwise.
 */
export function isLicensePayload(payload: any): payload is LicensePayload {
  return typeof payload === 'object' && 'auth' in payload && payload.auth.startsWith("HKMIVYS-");
}

/**
 * Checks if the given payload is of type SessionPayload.
 * @param payload The payload to check.
 * @returns True if the payload is of type SessionPayload, false otherwise.
 */
export function isSessionPayload(payload: any): payload is SessionPayload {
  return typeof payload === 'object' && 'userId' in payload && 'expiresAt' in payload;
}

