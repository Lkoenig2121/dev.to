import express, { Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user by username
router.get('/:username', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get user's posts
    const posts = await Post.find({ author: user._id, published: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      posts,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/:username', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if user is updating their own profile
    if (user._id.toString() !== req.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const { name, bio, avatar } = req.body;

    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.avatar = avatar !== undefined ? avatar : user.avatar;

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

