import { RequestHandler } from 'express';

export function ensureRole (roles: string[]): RequestHandler {
  return async (req, res, next) => {
    try {
      if (roles.includes(req.user!.role)) {
        return next();
      }

      req.flash('error', "Sorry, you don't have enough permissions to access that page.");
      res.redirect('/');

    } catch (error) {
      next(error);
    }
  };
}