import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Inventory from '../models/Inventory.js';
import { AppError } from '../utils/AppError.js';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const addItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Authentication required', 401);
    }

    const { name, quantity, category } = req.body;

    const item = await Inventory.create({
      userId: req.user.userId,
      name,
      quantity,
      category,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserInventory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Authentication required', 401);
    }

    const items = await Inventory.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Authentication required', 401);
    }

    const { id } = req.params;
    const updates = req.body;

    const item = await Inventory.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    Object.assign(item, updates);
    await item.save();

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Authentication required', 401);
    }

    const { id } = req.params;

    const item = await Inventory.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getInventoryStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Authentication required', 401);
    }

    const totalItems = await Inventory.countDocuments({ userId: req.user.userId });
    const lowStockItems = await Inventory.countDocuments({ 
      userId: req.user.userId,
      status: 'Low Stock'
    });

    res.json({
      success: true,
      data: {
        totalItems,
        lowStockItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Authentication required', 401);
    }

    const recentActivity = await Inventory.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .limit(3)
      .select('name quantity status updatedAt');

    const formattedActivity = recentActivity.map(item => ({
      _id: item._id,
      type: item.status === 'Out of Stock' ? 'out' : 'in',
      itemName: item.name,
      quantity: item.quantity,
      createdAt: item.updatedAt,
    }));

    res.json({
      success: true,
      data: formattedActivity,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Authentication required', 401);
    }

    const allActivity = await Inventory.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .select('name quantity status updatedAt');

    const formattedActivity = allActivity.map(item => ({
      _id: item._id,
      type: item.status === 'Out of Stock' ? 'out' : 'in',
      itemName: item.name,
      quantity: item.quantity,
      createdAt: item.updatedAt,
    }));

    res.json({
      success: true,
      data: formattedActivity,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      throw new AppError('Authentication required', 401);
    }

    // Get total value of inventory
    const items = await Inventory.find({ userId: req.user.userId });
    const totalValue = items.reduce((sum, item) => sum + (item.quantity), 0);

    // Get items sold (items with quantity changes)
    const itemsSold = items.filter(item => item.status === 'Out of Stock').length;

    // Get top performing items
    const topItems = await Inventory.find({ userId: req.user.userId })
      .sort({ quantity: -1 })
      .limit(3)
      .select('name quantity status');

    // Get inventory health stats
    const lowStock = await Inventory.countDocuments({ 
      userId: req.user.userId,
      status: 'Low Stock'
    });

    const outOfStock = await Inventory.countDocuments({ 
      userId: req.user.userId,
      status: 'Out of Stock'
    });

    const inStock = await Inventory.countDocuments({ 
      userId: req.user.userId,
      status: 'In Stock'
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalValue,
          itemsSold,
        },
        topPerforming: topItems,
        health: {
          lowStock,
          outOfStock,
          inStock,
        }
      },
    });
  } catch (error) {
    next(error);
  }
}; 