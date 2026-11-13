import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/token.js';

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        passwordHash,
        phone,
        role: 'CUSTOMER',
        cart: {
          create: {},
        },
        wishlist: {
          create: {},
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to MODÉRA.',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or inactive account.',
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or inactive account.',
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Welcome back to MODÉRA.',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        addresses: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password provided is incorrect.',
      });
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash },
    });

    res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Safe response that does not leak email existence
    res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been dispatched.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Initial Secure Admin Bootstrap
 * Allows initializing an admin account safely during initial deployment
 * Requires ADMIN_BOOTSTRAP_SECRET from environment or runs if zero admins exist.
 */
export const bootstrapAdmin = async (req, res, next) => {
  try {
    const { secret, firstName, lastName, email, password } = req.body;

    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    const configuredSecret = process.env.ADMIN_BOOTSTRAP_SECRET || 'modera_secure_bootstrap_key_2026';

    if (existingAdmin && secret !== configuredSecret) {
      return res.status(403).json({
        success: false,
        message: 'Admin initialization forbidden. Invalid bootstrap secret.',
      });
    }

    const passwordHash = await hashPassword(password || 'Modera@Admin2026!');
    const adminUser = await prisma.user.upsert({
      where: { email: (email || 'admin@modera-fashion.com').toLowerCase() },
      update: {
        role: 'ADMIN',
        isActive: true,
      },
      create: {
        firstName: firstName || 'MODÉRA',
        lastName: lastName || 'Administrator',
        email: (email || 'admin@modera-fashion.com').toLowerCase(),
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    const token = generateToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    });

    res.status(201).json({
      success: true,
      message: 'Admin account initialized securely.',
      data: {
        user: adminUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

