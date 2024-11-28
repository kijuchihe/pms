import { NextFunction, Request, Response } from "express";
import { UserService } from "./users.service";
import { catchAsync } from "../../shared/utils/catch-async";


export class UserController {
  private userService: UserService;

  constructor() {
    // super(new UserService());
    // this.userService = new UserService();
    this.userService = new UserService();
  }

  getUserTeams = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const teams = await this.userService.getUserTeams(userId, req.query);

    res.status(200).json({
      status: 'success',
      data: {
        teams
      }
    });
  })

  getUserProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const projects = await this.userService.getUserProjects(userId, req.query);
      res.status(200).json({
        status: 'success',
        message: 'User projects retrieved successfully',
        data: {
          projects
        }
      });
    } catch (error: any) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const user = await this.userService.updateUser(userId, req.body);

      res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: {
          user
        }
      });
    } catch (error: any) {
      next(error);
    }
  };
}