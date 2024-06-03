import { Request, Response } from "express";
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseBefore } from "routing-controllers";

import { AppDataSource } from "../config/db";
import { Course } from "../models/course";
import { ValidationHandler } from "../middlewars/validationHandler";
import { RoleAuth } from "../middlewars/roleAuth";

@Controller('/courses')
export class CourseController {

  @Get('/')
  async getAllCourses (@Req() req: Request, @Res() res: Response) {
    try {
      const courses = await AppDataSource.manager.find(Course);
      return res.status(200).json({
        status: 'success',
        data: { courses }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  @Get('/:courseId')
  async getById (@Param("courseId") courseId: any, @Req() req: Request, @Res() res: Response) {

    try {
      const findCourse = await AppDataSource.manager.findOneBy(Course, { course_id: courseId });
      return res.status(200).json({
        status: 'success',
        data: { findCourse }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  @Post('/')
  @UseBefore((req:any, res:any, next:any) => {
    // UseBefore function to pass dataEntity to the middleware
    const data = new Course();
    const {course_id, course_title, course_description, course_tutor, user_role} = req.body;
    data.course_id = course_id;
    data.course_title = course_title;
    data.course_description = course_description;
    data.course_tutor = course_tutor,
    data.user_role = user_role;

    const validationHandler = new ValidationHandler(data);
    validationHandler.use(req, res, next);
  })
  @UseBefore((req:any, res:any, next:any) => {
    const routeAuthorization = new RoleAuth("tutor");
    routeAuthorization.use(req,res,next);
  })
  async createCourse (@Body() courses: Course, @Req() req: Request, @Res() res: Response) {

    try {
      const createCourse = await AppDataSource.manager.save(courses);
      return res.status(200).json({
        status: 'success',
        data: { createCourse }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  @UseBefore((req:any, res:any, next:any) => {
    const routeAuthorization = new RoleAuth("tutor");
    routeAuthorization.use(req,res,next);
  })
  @Put('/:courseId')
  async updateCourse (@Param("courseId") courseId: any, @Body() courses: Course, @Req() req: Request, @Res() res: Response) {

    try {
      const findCourse = await AppDataSource.manager.findOneBy(Course, { course_id: courseId });

      if (!findCourse) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      const existingCourse = await AppDataSource.manager.update(Course, { course_id: courseId }, courses);
      return res.status(200).json({
        status: 'success',
        data: { existingCourse }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  @UseBefore((req:any, res:any, next:any) => {
    const routeAuthorization = new RoleAuth("tutor");
    routeAuthorization.use(req,res,next);
  })
  @Delete('/:courseId')
  async deleteCourse (@Param("courseId") courseId: any, @Req() req: Request, @Res() res: Response) {

    try {
      const findCourse = await AppDataSource.manager.findOneBy(Course, { course_id: courseId });

      if (!findCourse) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      const deleteCourse = await AppDataSource.manager.delete(Course, { course_id: courseId });
      return res.status(200).json({
        status: 'success',
        data: { deleteCourse }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
