import jwt from 'jsonwebtoken';
import db from '../../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check for JWT in the Authorization header (for standard login)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. If not in header, check for JWT in the cookie (for social login)
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get the full user object from the database.
      const user = await db('users').where({ id: decoded.id }).first();

      // If a user is found, remove the password hash before attaching to the request.
      if (user) {
        delete user.password_hash;

        // * Note: Currently can't fetch facebook email so we skip this check.
        // Security Check 1: Ensure the user has verified their email.
        // This prevents unverified users from accessing protected routes.
        // if (!user.is_verified) {
        //   return res.status(403).json({ message: 'Please verify your email to continue.' });
        // }

        // Security Check 2: Invalidate token if password was changed after the token was issued.
        if (user.password_changed_at) {
          const passwordChangedTimestamp = parseInt(new Date(user.password_changed_at).getTime() / 1000, 10);
          if (decoded.iat < passwordChangedTimestamp) {
            return res.status(401).json({ message: 'User recently changed password. Please log in again.' });
          }
        }

        req.user = user;
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the protected route
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const isStaff = (req, res, next) => {
  // Admins are also considered staff for privilege purposes
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a staff member' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
