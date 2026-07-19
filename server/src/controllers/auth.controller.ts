import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  await authService.registerUser(req.body);
  res.status(201).json({ status: 'success', message: 'User registered successfully' });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.loginUser(req.body);
  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: {
      user: {
        id: data.user._id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email
      },
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    }
  });
});
