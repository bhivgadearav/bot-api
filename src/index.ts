import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import router from './routes';
import dbConnect from './db/connect';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}


const app = express();
app.use(express.json());
app.use('/api', router);

const PORT = parseInt(process.env.PORT || '3000') || 3000;

// Connect to MongoDB
dbConnect();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});