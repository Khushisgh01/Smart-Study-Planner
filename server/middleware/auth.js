import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Teacher from '../models/Teacher.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded.id is set by generateToken(id, role)
      req.user = { id: decoded.id, role: decoded.role };
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to restrict to teacher role only
export const teacherOnly = (req, res, next) => {
  if (req.user?.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied: teachers only' });
  }
  next();
};

// Middleware to restrict to student role only
export const studentOnly = (req, res, next) => {
  if (req.user?.role !== 'student') {
    return res.status(403).json({ message: 'Access denied: students only' });
  }
  next();
};