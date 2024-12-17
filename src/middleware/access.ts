import { Request, Response, NextFunction } from "express";

export const access = (req: Request, res: Response, next: NextFunction) => {
    const { API_TOKEN } = req.body;
    if (API_TOKEN !== process.env.API_TOKEN) {
        res.status(401).json({ error: 'Unauthorized server request.' });
        return; 
    }
    next();
};