import { Request, Response, NextFunction } from "express";
import { z } from "zod";

type ValidationSchema = z.ZodObject<{
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}>;

export const validate =
  (schema: ValidationSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;
      req.params = parsed.params;

      next();
    } catch (error) {
      next(error);
    }
  };
