import { Request, Response } from 'express';
import supabase from '../config/supabase';
import { postSchema, PostInput } from '../schemas/postSchema';
import { Post } from '../models/Post';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content }: PostInput = postSchema.parse(req.body);
    const authorId = (req.user as { id: string }).id;

    const { data: newPost, error } = await supabase
      .from('posts')
      .insert({ title, content, author_id: authorId })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { author } = req.query;
    let query = supabase.from('posts').select('*');

    if (author) {
      query = query.eq('author_id', author);
    }

    const { data: posts, error } = await query;

    if (error) throw error;

    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};