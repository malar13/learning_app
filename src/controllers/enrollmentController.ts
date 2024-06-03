import { Request, Response } from "express";
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseBefore } from "routing-controllers";
import axios from "axios";

import { Enrollment } from "../models/enrollment";
import { ValidationHandler } from "../middlewars/validationHandler";

@Controller('/enrollments')
export class EnrollmentController {

  @Get('/')
  async getAllEnrollments (@Req() req: Request, @Res() res: Response) {
    try {
      const enrollments = await axios.get("https://learningapp.free.beeceptor.com/api/enrollments");
      return res.status(200).json({
        status: 'success',
        data: enrollments.data
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  @Get('/:enrollmentId')
  async getById (@Param("enrollmentId") enrollmentId: any, @Req() req: Request, @Res() res: Response) {

    try {
      const findEnrollment = await axios.get(`https://learningapp.free.beeceptor.com/api/enrollments/${enrollmentId}`);
      return res.status(200).json({
        status: 'success',
        data: findEnrollment.data
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  @Post('/')
  @UseBefore((req:any, res:any, next:any) => {
    // UseBefore function to pass dataEntity to the middleware
    const data = new Enrollment();
    const {user_id, course_id, enrollment_date, enrollment_status} = req.body;
    data.user_id = user_id;
    data.course_id = course_id;
    data.enrollment_date = enrollment_date;
    data.enrollment_status = enrollment_status;
    
    const validationHandler = new ValidationHandler(data);
    validationHandler.use(req, res, next);
  })
  async createEnrollment (@Body() enrollments: Enrollment, @Req() req: Request, @Res() res: Response) {

    try {
      const createEnrollment = await axios.post("https://learningapp.free.beeceptor.com/api/enrollments", enrollments );
      return res.status(200).json({
        status: 'success',
        data: createEnrollment.data
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  @Put('/:enrollmentId')
  async updateEnrollment (@Param("enrollmentId") enrollmentId: any, @Body() enrollments: Enrollment, @Req() req: Request, @Res() res: Response) {

    try {
      const existingEnrollment = await axios.put(`https://learningapp.free.beeceptor.com/api/enrollments/${enrollmentId}`, enrollments);
      return res.status(200).json({
        status: 'success',
        data: existingEnrollment.data
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  @Delete('/:enrollmentId')
  async deleteEnrollment (@Param("enrollmentId") enrollmentId: any, @Req() req: Request, @Res() res: Response) {

    try {
      const deleteEnrollment = await axios.delete(`https://learningapp.free.beeceptor.com/api/enrollments/${enrollmentId}`);
      return res.status(200).json({
        status: 'success',
        data: deleteEnrollment.data
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
