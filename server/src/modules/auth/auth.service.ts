import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../users/users.entity';
import { BaseService } from '../../shared/utils/base.service';
import {
  UnauthorizedException,
  ConflictException,
  InternalServerException
} from '../../shared/exceptions';

type UserResponse = Omit<IUser, 'password'>;

export class AuthService extends BaseService<IUser> {
  constructor() {
    super(UserModel);
  }

  async register(userData: Partial<IUser>): Promise<{ user: UserResponse; token: string }> {
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await UserModel.create(userData);
    const token = this.generateToken(user);

    // Convert to plain object and exclude password
    const { password, ...userResponse } = user.toObject() as IUser;

    return { user: userResponse as UserResponse, token };
  }

  async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    // Convert to plain object and exclude password
    const { password: _, ...userResponse } = user.toObject();

    return { user: userResponse as UserResponse, token };
  }

  private generateToken(user: IUser): string {
    try {
      return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );
    } catch (error) {
      throw new InternalServerException('Error generating token');
    }
  }

  async verifyToken(token: string): Promise<UserResponse> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      const user = await UserModel.findById(decoded.id).select('-password');

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return user.toJSON();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
