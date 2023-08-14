import { RequestHandler } from 'express';

export function authRole (role: string): RequestHandler {
  return async (req, res, next) => {
    try {
      if (req.user!.role !== role) {
        res.status(401);
        return req.flash('error', "Sorry, you don't have enough permissions to access this page.");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}