import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};


/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

/**
* Authorization Required middleware.
*/
// export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
//   const provider = req.path.split("/").slice(-1)[0];

//   const user = req.user as UserDocument;
//   if (find(user.tokens, { kind: provider })) {
//       next();
//   } else {
//       res.redirect(`/auth/${provider}`);
//   }
// };