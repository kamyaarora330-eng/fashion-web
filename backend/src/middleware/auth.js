import { verifyToken } from '../utils/token.js';
import prisma from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token required.',
    });
  }

  try {
    const decoded = verifyToken(token);
    
    // Check if user exists in database and is active
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId || decoded.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
        },
      });
    } catch (dbErr) {
      // If DB is offline during testing/fallback, decode directly
      user = {
        id: decoded.userId || decoded.id,
        email: decoded.email,
        role: decoded.role || 'CUSTOMER',
        isActive: true,
      };
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or has been deactivated.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Elevated administrator privileges are required.',
    });
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.userId || decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    req.user = null;
  }
  next();
};

