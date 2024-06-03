import { Request, Response, NextFunction } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { validate } from 'class-validator';

export class ValidationHandler implements ExpressMiddlewareInterface {

  private dataEnity: any; 

  constructor(dataEnity: any) {
    this.dataEnity = dataEnity;
  }

  use(req: Request, res: Response, next: NextFunction): any {
    this.validation(req, res, next);
  }

  public validation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = await validate(this.dataEnity, {
        validationError: { target: false },
      });

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => {
          return {
            property: error.property,
            value: error.value,
            constraints: error.constraints,
          };
        });
  
        return res.status(400).json({
          message: "Validation Failed",
          errors: formattedErrors,
        });
      }
      next();
    } catch (error) {
      console.error("Error during validation:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

}
