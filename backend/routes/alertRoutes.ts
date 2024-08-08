import express, { Request, Response, NextFunction } from 'express';
import { createAlert, getAlerts } from '../controllers/alertController';
import jwt, { JwtPayload } from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secretcheppanubrother';

// Define a custom interface for the JWT payload
interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

// Authentication middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    (req as any).userId = decoded.userId; // use type assertion to add userId property
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Routes
router.post('/alerts', authenticate, createAlert);
router.get('/alerts/:userId', authenticate, getAlerts); // Adjusted to use query parameter or request.userId for filtering

export default router;