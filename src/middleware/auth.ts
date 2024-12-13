import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { NextFunction, Request, Response } from 'express';

// remove jwt verification and use password sent in req.body to authorize user requests
// test if the current jwt authentication works and put it in a jwt branch so I can go back to it if needed
const SECRET = process.env.JWT_SECRET || 'defaultsecret';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return; 
        }

        const decoded = jwt.verify(token, SECRET) as jwt.JwtPayload;
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ message: 'Invalid token' });
            return; 
        }
        req.user = user;

        if (!req.user) {
            res.status(401).json({ message: 'Invalid token' });
            return; 
        }

        next();
    } catch (error: any) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token expired, please login again. This measure is for your own security.' });
            return; 
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
            return; 
        }
        else {
            res.status(401).json({ message: 'Authentication failed', details: error.message });
            return; 
        }
    }
};
