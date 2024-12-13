import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// remove jwt verification and use password sent in req.body to authorize user requests
// test if the current jwt authentication works and put it in a jwt branch so I can go back to it if needed
const SECRET = process.env.JWT_SECRET || 'defaultsecret';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { telegramId, password } = req.body;
        if (!telegramId || !password) {
            res.status(401).json({ message: 'Telegram ID or password missing in request.' });
            return; 
        }
        const user = await User.findById(telegramId);
        if (!user) {
            res.status(401).json({ message: 'User is not registered.' });
            return; 
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password.' });
            return; 
        }
        req.user = user;
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
