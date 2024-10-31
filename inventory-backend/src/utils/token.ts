import jwt from 'jsonwebtoken';
import type { IUser } from '../models/User.js';
import type { Types } from 'mongoose';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (user: IUser & { _id: Types.ObjectId }): string => {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): TokenPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}; 