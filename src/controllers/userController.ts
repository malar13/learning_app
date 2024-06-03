import { Request, Response } from "express";
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseBefore } from "routing-controllers";

import { AppDataSource } from "../config/db";
import { User } from "../models/user";
import { ValidationHandler } from "../middlewars/validationHandler";

@Controller('/users')
export class UserController {

  private userRepository = AppDataSource.getRepository(User);

  @Get('/')
  async getAllUsers (@Req() req: Request, @Res() res: Response) {
    try {
      const users = await this.userRepository.find({
        select: {
          user_name: true,
          user_password: true,
          user_email: true,
          user_role: true
        }
      });
      return res.status(200).json({
        status: 'success',
        data: { users }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  @Get('/:userId')
  async getById (@Param("userId") userId: any, @Req() req: Request, @Res() res: Response) {

    try {
      const findUser = await this.userRepository.findOneBy({ id: userId });
      return res.status(200).json({
        status: 'success',
        data: { findUser }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  @Post('/')
  @UseBefore((req:any, res:any, next:any) => {
    // UseBefore function to pass dataEntity to the middleware
    const data = new User();
    const {user_name, user_password, user_email, user_role} = req.body;
    data.user_name = user_name;
    data.user_password = user_password;
    data.user_email = user_email;
    data.user_role = user_role;
    
    const validationHandler = new ValidationHandler(data);
    validationHandler.use(req, res, next);
  })
  async createUser (@Body() users: User, @Req() req: Request, @Res() res: Response) {

    try {
      const createUser = await this.userRepository.save(users);
      return res.status(200).json({
        status: 'success',
        data: { createUser }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message })
    }
  }

  @Put('/:userId')
  async updateUser (@Param("userId") userId: any, @Body() users: User, @Req() req: Request, @Res() res: Response) {

    try {
      const findUser = this.userRepository.findOneBy({ id: userId });

      if (!findUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const existingUser = await this.userRepository.update({ id: userId }, users);
      return res.status(200).json({
        status: 'success',
        data: { existingUser }
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  @Delete('/:userId')
  async deleteUser (@Param("userId") userId: any, @Req() req: Request, @Res() res: Response) {

    try {
      const findUser = this.userRepository.findOneBy({ id: userId });
      if (!findUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const deleteUser = this.userRepository.delete({ id: userId });
      return res.status(200).json({
        status: 'success',
        data: { deleteUser }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
