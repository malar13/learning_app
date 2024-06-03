import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

//type after to ensure that it runs after the regular route handlers and 
//avoids conflicts with headers that might be set there
//@Middlware decorator is Global middleware declare in app.ts
@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressMiddlewareInterface {

  use(req: Request, res: Response, next: NextFunction): any {
    this.handlingError(req, res, next);
    next();
  }

  public handlingError = (req: Request, res: Response, next: NextFunction) => {
    const errStatus = 500;
    const errMsg = 'Something Went Wrong';

    // Check if headers are already sent to avoid http header errors
    if (res.headersSent) {
      return next();
    }
    return res.status(errStatus).json({
      success: false,
      status: errStatus,
      message: errMsg,
    });
  }

}
