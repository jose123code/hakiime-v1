
import serveStatic from "serve-static";
import compression from "compression";
import { NextFunction, Response, Request } from "express";

export function setCustomCacheControl(res, path) {
  if (serveStatic.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'public, max-age=0')
  }
}

export function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}
export const HkmCodepowerdBy = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader('X-Powered-By', 'hkmcode');
  next();
}