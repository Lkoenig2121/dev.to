import express, { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all posts (with optional filtering)
router.get('/', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tag, search, limit = '20', page = '1' } = req.query;
    const limitNum = parseInt(limit as string);
    const skip = (parseInt(page as string) - 1) * limitNum;

    let query: any = { published: true };

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const posts = await Post.find(query)
      .populate('author', 'username name avatar')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'username name avatar bio'
    );

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create post
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, excerpt, coverImage, tags, published } = req.body;

    // Calculate read time (approx 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const post = new Post({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200),
      coverImage,
      tags: tags || [],
      author: req.userId,
      readTime,
      published: published !== undefined ? published : true,
    });

    await post.save();
    await post.populate('author', 'username name avatar');

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update post
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if user is the author
    if (post.author.toString() !== req.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const { title, content, excerpt, coverImage, tags, published } = req.body;

    // Recalculate read time if content changed
    if (content) {
      const wordCount = content.split(/\s+/).length;
      post.readTime = Math.ceil(wordCount / 200);
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    post.tags = tags || post.tags;
    post.published = published !== undefined ? published : post.published;

    await post.save();
    await post.populate('author', 'username name avatar');

    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if user is the author
    if (post.author.toString() !== req.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await post.deleteOne();

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike post
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const userIdObj = req.userId as any;
    const likeIndex = post.likes.findIndex((id: any) => id.toString() === userIdObj);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userIdObj);
    }

    await post.save();

    res.json({ likes: post.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

