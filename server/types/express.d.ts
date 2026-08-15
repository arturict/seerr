/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User } from '@server/entity/User';
import type { NextFunction, Request, Response } from 'express';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    oidcState?: string;
    oidcNonce?: string;
    oidcCodeVerifier?: string;
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      locale?: string;
    }
  }

  export type Middleware = <ParamsDictionary, any, any>(
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | NextFunction> | void | NextFunction;
}
