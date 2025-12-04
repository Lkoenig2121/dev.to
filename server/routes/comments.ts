import express, { Request, Response } from 'express';
import Comment from '../models/Comment';
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      parentComment: null,
    })
      .populate('author', 'username name avatar')
      .sort({ createdAt: -1 });

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'username name avatar')
          .sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    res.json(commentsWithReplies);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create comment
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, postId, parentCommentId } = req.body;

    const comment = new Comment({
      content,
      author: req.userId,
      post: postId,
      parentComment: parentCommentId || null,
    });

    await comment.save();
    await comment.populate('author', 'username name avatar');

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update comment
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    // Check if user is the author
    if (comment.author.toString() !== req.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    comment.content = req.body.content || comment.content;
    await comment.save();
    await comment.populate('author', 'username name avatar');

    res.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    // Check if user is the author
    if (comment.author.toString() !== req.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });

    await comment.deleteOne();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike comment
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const userIdObj = req.userId as any;
    const likeIndex = comment.likes.findIndex((id: any) => id.toString() === userIdObj);

    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like
      comment.likes.push(userIdObj);
    }

    await comment.save();

    res.json({ likes: comment.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

