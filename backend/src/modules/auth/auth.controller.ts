import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { catchAsync } from '../../shared/utils/catch-async';
import { BadRequestException } from '../../shared/exceptions';
import { IUser } from './auth.entity';

type UserResponse = Omit<IUser, 'password'>;

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = catchAsync(async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
      throw new BadRequestException('Email and password are required');
    }

    const { user, token } = await this.authService.register(req.body);
    
    res.status(201).json({
      status: 'success',
      data: { user, token }
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const { user, token } = await this.authService.login(email, password);
    
    res.status(200).json({
      status: 'success',
      data: { user, token }
    });
  });

  getProfile = catchAsync(async (req: Request, res: Response) => {
    const user = await this.authService.findById(req.user.id);
    
    // Convert to plain object and exclude password
    const { password, ...userResponse } = user?.toObject();
    
    res.status(200).json({
      status: 'success',
      data: { user: userResponse }
    });
  });

  updateProfile = catchAsync(async (req: Request, res: Response) => {
    // Prevent password update through this endpoint
    const { password, ...updateData } = req.body;
    
    const user = await this.authService.update(req.user.id, updateData);
    
    // Convert to plain object and exclude password
    const { password: _, ...userResponse } = user?.toObject();
    
    res.status(200).json({
      status: 'success',
      data: { user: userResponse }
    });
  });
}
