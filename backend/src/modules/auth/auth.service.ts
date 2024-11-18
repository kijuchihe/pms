import jwt from 'jsonwebtoken';
import { User, IUser } from './auth.entity';
import { BaseService } from '../../shared/utils/base.service';
import { 
  UnauthorizedException,
  ConflictException,
  InternalServerException 
} from '../../shared/exceptions';

type UserResponse = Omit<IUser, 'password'>;

export class AuthService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  async register(userData: Partial<IUser>): Promise<{ user: UserResponse; token: string }> {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await User.create(userData);
    const token = this.generateToken(user);

    // Convert to plain object and exclude password
    const { password, ...userResponse } = user.toObject();

    return { user: userResponse, token };
  }

  async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    const user = await User.findOne({ email }).select('+password');
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

    return { user: userResponse, token };
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
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return user.toObject();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
