import { Request, Response, NextFunction } from "express";

export default (fn: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      return fn(req, res, next);
    } catch (error) {
      res.status(500);
      res.json({ msg: error });
      res.end();
      return;
    }
  };
