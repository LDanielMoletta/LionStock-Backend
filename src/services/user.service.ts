import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import User, { IUser, UserRole } from '../models/user.model';

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado no ambiente.');
  }
  return process.env.JWT_SECRET;
};

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  active?: boolean;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  active?: boolean;
}

type UserWithoutPassword = Omit<IUser, 'password'>;

class UserService {
  async createUser(data: CreateUserInput): Promise<UserWithoutPassword> {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw { statusCode: 409, message: 'E-mail já cadastrado.' };
    }

    const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = new User({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashed,
      role: data.role || 'viewer',
      active: typeof data.active === 'boolean' ? data.active : true,
    });

    await user.save();
    const obj = user.toObject();
    const { password, ...userWithoutPassword } = obj;
    return userWithoutPassword as UserWithoutPassword;
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await User.find().select('-password').lean();
    return users as UserWithoutPassword[];
  }

  async findById(id: string): Promise<UserWithoutPassword> {
    const user = await User.findById(id).select('-password').lean();
    if (!user) throw { statusCode: 404, message: 'Usuário não encontrado.' };
    return user as UserWithoutPassword;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserWithoutPassword> {
    const updates = { ...data };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }
    if (updates.email) updates.email = updates.email.toLowerCase();

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password').lean();
    if (!user) throw { statusCode: 404, message: 'Usuário não encontrado.' };
    return user as UserWithoutPassword;
  }

  async deleteUser(id: string): Promise<UserWithoutPassword> {
    const user = await User.findByIdAndDelete(id).select('-password').lean();
    if (!user) throw { statusCode: 404, message: 'Usuário não encontrado.' };
    return user as UserWithoutPassword;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  async validatePassword(user: IUser, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.password);
  }

  generateToken(user: IUser): string {
    const payload = { id: user._id, role: user.role, email: user.email };
    return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }
}

export default new UserService();