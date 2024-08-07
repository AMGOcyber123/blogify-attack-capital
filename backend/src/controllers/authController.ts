import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import supabase from '../config/supabase';
import { userSchema, UserInput } from '../schemas/userSchema';
import { User } from '../models/User';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: UserInput = userSchema.parse(req.body);
    
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ email, password_hash: passwordHash })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: UserInput = userSchema.parse(req.body);

    const { data: user } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.json({ "message": "Welcome to the backend of the application", token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1] as string;
    if(!token) {
      res.status(400).json({ message: 'No token provided' });
      return;
    }
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: 'Could not log out, please try again' });
      } else {
        res.clearCookie('connect.sid'); // clear the session cookie
        res.json({ message: 'Logged out successfully' });
      }
    });
  }
  catch(error) {
    res.status(500).json({ message: 'Logout Failed'});
  }
};

