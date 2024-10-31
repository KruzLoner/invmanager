import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { generateToken } from '../utils/token.js';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Register endpoint hit');
    console.log('Request body:', req.body);

    const { firstName, lastName, email, password, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phone) {
      console.log('Missing fields:', { firstName, lastName, email, phone, password: '***' });
      throw new AppError('All fields are required', 400);
    }

    // Check for existing user
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log('User already exists with email:', email);
      throw new AppError('Email already in use', 400);
    }

    // Create new user
    console.log('Creating new user with data:', {
      firstName,
      lastName,
      email,
      phone,
      password: '***'
    });

    const user = new User({
      firstName,
      lastName,
      email,
      password, // Will be hashed by the pre-save hook
      phone,
      role: 'user' // Default role
    });

    // Save user to database
    console.log('Attempting to save user to database...');
    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser._id);

    // Generate JWT token
    console.log('Generating token for user');
    const token = generateToken(savedUser);

    // Send response
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: savedUser._id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          role: savedUser.role,
        },
      },
    });

    console.log('Registration complete - response sent');
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      console.error('Validation error details:', error.errors);
    }
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Login request received:', { ...req.body, password: '***' });

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing credentials');
      throw new AppError('Email and password are required', 400);
    }

    console.log('Finding user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found with email:', email);
      throw new AppError('Invalid credentials', 401);
    }

    console.log('Comparing passwords...');
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('Password does not match');
      throw new AppError('Invalid credentials', 401);
    }

    console.log('Generating token for user:', user._id);
    const token = generateToken(user);

    console.log('Sending successful login response');
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};