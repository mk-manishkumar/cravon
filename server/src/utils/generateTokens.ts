import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string): string => {
  const secret = process.env.JWT_ACCESS_SECRET || 'fallback_access_secret';
  return jwt.sign({ id: userId }, secret, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};
