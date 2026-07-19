import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import UserRole from '../models/userRole.model.js';
import RefreshToken from '../models/refreshToken.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { ApiError } from '../utils/errorHandler.js';

export const registerUser = async (data: any) => {
  const { firstName, lastName, email, password, phone } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName, lastName, email, password: hashedPassword, phone, status: 'active'
  });

  const customerRole = await Role.findOne({ roleName: 'Customer' });
  if (customerRole) {
    await UserRole.create({ userId: newUser._id, roleId: customerRole._id });
  }

  return newUser;
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password || '');
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshTokenStr = generateRefreshToken(user._id.toString());

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId: user._id, token: refreshTokenStr, expiresAt, isRevoked: false
  });

  return { user, accessToken, refreshToken: refreshTokenStr };
};
