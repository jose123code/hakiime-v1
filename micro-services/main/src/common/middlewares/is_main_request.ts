import { Request, Response, NextFunction } from 'express';

export const isMainRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  if(!isApiCall(req.originalUrl)){
    req.isMain = true;
    req.template = req.originalUrl.replace(/^\/+|\/+$/g, '');

    if(isAuthCall(req.originalUrl)){
      req.layout = "authLayout";
    }else{
      req.layout = "layout";
    }
  }

  next();
};

export function isApiCall(str: string): boolean {
  const trimmedStr = str.replace(/^\/+|\/+$/g, ''); // Trim leading and trailing slashes
  return trimmedStr.startsWith("api") || trimmedStr.startsWith("ajax");
}

export function isAuthCall(str: string): boolean {
  const trimmedStr = str.replace(/^\/+|\/+$/g, ''); // Trim leading and trailing slashes
  return trimmedStr.startsWith("auth")
}