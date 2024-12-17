"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.access = void 0;
const access = (req, res, next) => {
    const { API_TOKEN } = req.body;
    if (API_TOKEN !== process.env.API_TOKEN) {
        res.status(401).json({ error: 'Unauthorized server request.' });
        return;
    }
    next();
};
exports.access = access;
