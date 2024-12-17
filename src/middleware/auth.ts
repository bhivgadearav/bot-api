import User from '../models/userModel';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { telegramId, password } = req.body;
        if (!telegramId || !password) {
            res.status(401).json({ error: 'Telegram ID or password missing in request.' });
            return; 
        }
        const user = await User.findOne({
            telegramId: telegramId
        });
        if (!user) {
            res.status(401).json({ error: 'User is not registered.' });
            return; 
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid password.' });
            return; 
        }
        req.user = user;
        next();
    } catch (error: any) {
        res.status(401).json({ error: 'Authentication failed', details: error.message });
        return; 
    }
};
