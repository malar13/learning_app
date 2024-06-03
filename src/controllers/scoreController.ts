import { Request, Response } from "express";
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseBefore } from "routing-controllers";

import { Score } from "../models/score";
import { ValidationHandler } from "../middlewars/validationHandler";
import { RoleAuth } from "../middlewars/roleAuth";

@Controller('/scores')
export class ScoreController {

  @Get('/')
  async getAllScores(@Req() req: Request, @Res() res: Response) {
    try {
      const scores = await Score.find();
      return res.status(200).json({
        status: 'success',
        data: { scores }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  @Get('/:scoreId')
  async getById(@Param("scoreId") scoreId: any, @Req() req: Request, @Res() res: Response) {

    try {
      const findScore = await Score.findOneBy({id: scoreId });
      return res.status(200).json({
        status: 'success',
        data: { findScore }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  @Post('/')
  @UseBefore((req:any, res:any, next:any) => {
    // UseBefore function to pass dataEntity to the middleware
    const data = new Score();
    const {user_id, course_id, score, user_role} = req.body;
    data.user_id = user_id;
    data.course_id = course_id;
    data.score = score;
    data.user_role = user_role;

    const validationHandler = new ValidationHandler(data);
    validationHandler.use(req, res, next);
  })
  @UseBefore((req:any, res:any, next:any) => {
    const routeAuthorization = new RoleAuth("tutor");
    routeAuthorization.use(req,res,next);
  })
  async createScore(@Body() scores: Score, @Req() req: Request, @Res() res: Response) {

    try {
      const createScore = await Score.save(scores);
      return res.status(200).json({
        status: 'success',
        data: { createScore }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  @UseBefore((req:any, res:any, next:any) => {
    const routeAuthorization = new RoleAuth("tutor");
    routeAuthorization.use(req,res,next);
  })
  @Put('/:scoreId')
  async updateScore (@Param("scoreId") scoreId: any, @Body() scores: Score, @Req() req: Request, @Res() res: Response) {

    try {
      const findScore = await Score.findOneBy({id: scoreId });

      if (!findScore) {
        return res.status(404).json({ success: false, message: 'Score not found' });
      }

      const existingScore = await Score.update({ id: scoreId }, scores);
      return res.status(200).json({
        status: 'success',
        data: { existingScore }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  @UseBefore((req:any, res:any, next:any) => {
    const routeAuthorization = new RoleAuth("tutor");
    routeAuthorization.use(req,res,next);
  })
  @Delete('/:scoreId')
  async deleteScore(@Param("scoreId") scoreId: any, @Req() req: Request, @Res() res: Response) {

    try {
      const findScore = await Score.findOneBy({ id: scoreId });

      if (!findScore) {
        return res.status(404).json({ success: false, message: 'Score not found' });
      }

      const deleteScore = await Score.delete({ id: scoreId });
      return res.status(200).json({
        status: 'success',
        data: { deleteScore }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
