import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface } from "routing-controllers";

export class RoleAuth implements ExpressMiddlewareInterface {

  private role: any;

  constructor(role: any) {
    this.role = role;
  }

  use(req: Request, res: Response, next: NextFunction): any {
    this.authorize(req, res, next);
  }

  //Grant access to specific routes via role
  public authorize = (req: Request, res: Response, next: NextFunction) => {
    if (!this.role.includes(req.body.user_role)) {
      return res.status(400).json({
        success: false,
        message: `User role ${req.body.user_role} is not authorized to access this route`
      });
    }
    next();
  }

}