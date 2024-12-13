import { UserInterface } from '../models/userModel';  
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface;  
    }
  }
}
