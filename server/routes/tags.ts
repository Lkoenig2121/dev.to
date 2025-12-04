import express, { Request, Response } from 'express';
import Tag from '../models/Tag';
import Post from '../models/Post';

const router = express.Router();

// Get all tags
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await Tag.find().sort({ postCount: -1 }).limit(50);
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tag by slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    res.json(tag);
  } catch (error) {
    console.error('Get tag error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get popular tags
router.get('/popular', async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await Tag.find().sort({ postCount: -1 }).limit(10);
    res.json(tags);
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sync tags from posts (utility endpoint)
router.post('/sync', async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find({ published: true });
    const tagMap = new Map<string, number>();

    // Count tag occurrences
    posts.forEach((post) => {
      post.tags.forEach((tag: string) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    // Update or create tags
    for (const [tagName, count] of tagMap.entries()) {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-');

      await Tag.findOneAndUpdate(
        { slug },
        {
          name: tagName,
          slug,
          postCount: count,
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Tags synced successfully', count: tagMap.size });
  } catch (error) {
    console.error('Sync tags error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

