import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Post from './models/Post';
import Comment from './models/Comment';
import Tag from './models/Tag';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devto';

// Mock user data
const mockUsers = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe',
    bio: 'Full-stack developer passionate about JavaScript and React. Love building things that make a difference.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  },
  {
    username: 'sarahsmith',
    email: 'sarah@example.com',
    password: 'password123',
    name: 'Sarah Smith',
    bio: 'Frontend engineer specializing in React and TypeScript. Coffee lover ☕',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  },
  {
    username: 'mikejohnson',
    email: 'mike@example.com',
    password: 'password123',
    name: 'Mike Johnson',
    bio: 'Backend wizard working with Node.js and MongoDB. Always learning something new.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
  },
  {
    username: 'emilychen',
    email: 'emily@example.com',
    password: 'password123',
    name: 'Emily Chen',
    bio: 'DevOps engineer and cloud enthusiast. Kubernetes is my jam 🚀',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
  },
  {
    username: 'alexbrown',
    email: 'alex@example.com',
    password: 'password123',
    name: 'Alex Brown',
    bio: 'UI/UX designer who codes. Making the web beautiful one pixel at a time.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  },
  {
    username: 'lisawang',
    email: 'lisa@example.com',
    password: 'password123',
    name: 'Lisa Wang',
    bio: 'Data scientist and Python enthusiast. Turning data into insights.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
  },
  {
    username: 'davidkim',
    email: 'david@example.com',
    password: 'password123',
    name: 'David Kim',
    bio: 'Mobile developer building iOS and Android apps. Swift and Kotlin expert.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
  },
  {
    username: 'rachelgreen',
    email: 'rachel@example.com',
    password: 'password123',
    name: 'Rachel Green',
    bio: 'Tech writer and community builder. Helping developers tell their stories.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel',
  },
];

// Mock posts data
const mockPosts = [
  {
    title: 'Getting Started with Next.js 15: A Complete Guide',
    content: `Next.js 15 has arrived with some amazing new features! In this comprehensive guide, I'll walk you through everything you need to know to get started.

## What's New in Next.js 15?

The latest version of Next.js brings several exciting improvements:

1. **Improved Performance**: Faster build times and optimized bundle sizes
2. **Better Developer Experience**: Enhanced error messages and debugging tools
3. **New App Router Features**: More powerful routing capabilities
4. **Turbopack Improvements**: Significantly faster compilation times

## Getting Started

To create a new Next.js 15 project, simply run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will set up a new project with all the latest features and best practices.

## Key Features to Explore

### Server Components
Server Components allow you to render components on the server, reducing the JavaScript bundle size sent to the client.

### App Router
The App Router provides a new way to structure your application with improved layouts and nested routes.

### Image Optimization
Next.js includes built-in image optimization that automatically serves images in modern formats.

## Conclusion

Next.js 15 is a powerful framework that makes building React applications a breeze. Give it a try on your next project!`,
    excerpt: 'A comprehensive guide to getting started with Next.js 15 and its new features.',
    tags: ['nextjs', 'react', 'javascript', 'webdev'],
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  },
  {
    title: 'Understanding TypeScript Generics',
    content: `TypeScript generics can seem intimidating at first, but they're one of the most powerful features of the language. Let's demystify them!

## What Are Generics?

Generics allow you to write reusable code that works with multiple types while maintaining type safety.

## Basic Example

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>("Hello");
\`\`\`

## Generic Constraints

You can constrain generics to specific types:

\`\`\`typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
\`\`\`

## Real-World Use Cases

Generics shine in scenarios like:
- API response handling
- Data transformation functions
- Custom hooks in React
- Utility functions

## Best Practices

1. Use meaningful generic names
2. Don't over-engineer with generics
3. Leverage constraints when needed
4. Document your generic functions

Generics might seem complex, but with practice, they'll become second nature!`,
    excerpt: 'Learn how to use TypeScript generics effectively with practical examples.',
    tags: ['typescript', 'javascript', 'tutorial', 'programming'],
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
  },
  {
    title: 'Building a REST API with Express and MongoDB',
    content: `Let's build a production-ready REST API using Express.js and MongoDB!

## Project Setup

First, initialize your project:

\`\`\`bash
npm init -y
npm install express mongoose dotenv cors
npm install -D typescript @types/express @types/node
\`\`\`

## Creating the Server

\`\`\`typescript
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Defining Models

Use Mongoose to define your data models:

\`\`\`typescript
const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});
\`\`\`

## Creating Routes

Organize your routes for better maintainability:

\`\`\`typescript
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
\`\`\`

## Error Handling

Implement proper error handling middleware.

## Authentication

Add JWT authentication for secure endpoints.

Happy coding!`,
    excerpt: 'Step-by-step guide to building a REST API with Express.js and MongoDB.',
    tags: ['nodejs', 'express', 'mongodb', 'backend', 'tutorial'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
  },
  {
    title: '10 CSS Tips Every Developer Should Know',
    content: `CSS can be tricky, but these tips will level up your styling game!

## 1. Use CSS Variables

\`\`\`css
:root {
  --primary-color: #3b49df;
  --spacing: 1rem;
}

.button {
  background: var(--primary-color);
  padding: var(--spacing);
}
\`\`\`

## 2. Flexbox for Centering

The easiest way to center elements:

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

## 3. Grid for Layouts

CSS Grid is perfect for complex layouts:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
\`\`\`

## 4. Use clamp() for Responsive Typography

\`\`\`css
h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
\`\`\`

## 5. Smooth Scrolling

\`\`\`css
html {
  scroll-behavior: smooth;
}
\`\`\`

## 6-10 [More tips...]

Keep practicing and you'll master CSS in no time!`,
    excerpt: 'Essential CSS tips and tricks to improve your web development skills.',
    tags: ['css', 'webdev', 'frontend', 'design'],
    coverImage: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800',
  },
  {
    title: 'React Hooks: useEffect Best Practices',
    content: `The useEffect hook is powerful but can be misused. Let's explore best practices!

## Understanding useEffect

useEffect lets you perform side effects in function components.

## Basic Usage

\`\`\`javascript
useEffect(() => {
  // Side effect code here
  
  return () => {
    // Cleanup code here
  };
}, [dependencies]);
\`\`\`

## Common Pitfalls

1. **Missing Dependencies**: Always include all dependencies
2. **Infinite Loops**: Be careful with state updates
3. **Memory Leaks**: Clean up subscriptions

## Best Practices

### 1. Keep Effects Simple
Each effect should do one thing.

### 2. Use Multiple Effects
Split unrelated logic into separate effects.

### 3. Cleanup Properly
Always return a cleanup function for subscriptions.

### 4. Optimize with useMemo and useCallback
Prevent unnecessary re-runs.

## Example: Data Fetching

\`\`\`javascript
useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    const result = await api.getData();
    if (!cancelled) {
      setData(result);
    }
  }
  
  fetchData();
  
  return () => {
    cancelled = true;
  };
}, []);
\`\`\`

Master these patterns and your React code will be much cleaner!`,
    excerpt: 'Learn the best practices for using the useEffect hook in React applications.',
    tags: ['react', 'javascript', 'hooks', 'frontend'],
    coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800',
  },
  {
    title: 'Introduction to MongoDB Aggregation Pipeline',
    content: `MongoDB's aggregation pipeline is incredibly powerful. Let's learn how to use it!

## What is Aggregation?

Aggregation operations process data records and return computed results.

## Pipeline Stages

The aggregation pipeline consists of stages:

\`\`\`javascript
db.collection.aggregate([
  { $match: { status: "active" } },
  { $group: { _id: "$category", total: { $sum: 1 } } },
  { $sort: { total: -1 } }
]);
\`\`\`

## Common Stages

### $match
Filter documents like find()

### $group
Group documents by a field

### $project
Reshape documents

### $sort
Order results

### $lookup
Perform joins

## Real-World Example

\`\`\`javascript
const result = await Post.aggregate([
  { $match: { published: true } },
  { $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "authorInfo"
  }},
  { $unwind: "$authorInfo" },
  { $group: {
      _id: "$authorInfo.username",
      postCount: { $sum: 1 }
  }},
  { $sort: { postCount: -1 } },
  { $limit: 10 }
]);
\`\`\`

## Performance Tips

1. Use indexes
2. Put $match early in pipeline
3. Use $project to limit fields
4. Monitor with explain()

Aggregation pipelines are essential for complex queries!`,
    excerpt: 'Master MongoDB aggregation pipeline for powerful data queries.',
    tags: ['mongodb', 'database', 'backend', 'tutorial'],
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
  },
  {
    title: 'Tailwind CSS: Utility-First CSS Framework',
    content: `Tailwind CSS has revolutionized how we write CSS. Here's why you should try it!

## What is Tailwind?

Tailwind is a utility-first CSS framework that provides low-level utility classes.

## Why Tailwind?

1. **Faster Development**: Build UIs without writing custom CSS
2. **Consistency**: Design system built-in
3. **Smaller CSS**: Only includes classes you use
4. **Responsive Design**: Mobile-first approach

## Example

Instead of writing:

\`\`\`css
.button {
  background-color: blue;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
}
\`\`\`

You write:

\`\`\`html
<button class="bg-blue-500 px-8 py-4 rounded-lg">
  Click me
</button>
\`\`\`

## Customization

Tailwind is fully customizable via tailwind.config.js:

\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#3b49df',
      },
    },
  },
};
\`\`\`

## Best Practices

1. Use @apply for repeated patterns
2. Leverage responsive utilities
3. Configure your design tokens
4. Use JIT mode for development

## Component Example

\`\`\`html
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <img class="w-full" src="image.jpg" alt="Sunset">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
    <p class="text-gray-700 text-base">
      Lorem ipsum dolor sit amet.
    </p>
  </div>
</div>
\`\`\`

Give Tailwind a try - you might never go back to traditional CSS!`,
    excerpt: 'Discover why Tailwind CSS is changing the way developers build user interfaces.',
    tags: ['tailwind', 'css', 'frontend', 'webdev'],
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
  },
  {
    title: 'Git Workflow Best Practices for Teams',
    content: `Working with Git in a team? These workflows will save you headaches!

## Branch Naming Conventions

Use clear, consistent branch names:
- \`feature/user-authentication\`
- \`bugfix/login-error\`
- \`hotfix/security-patch\`

## Commit Messages

Write meaningful commit messages:

\`\`\`
feat: add user authentication
fix: resolve login timeout issue
docs: update API documentation
\`\`\`

## The Feature Branch Workflow

1. Create a branch from main
2. Make changes and commit
3. Push and create PR
4. Review and merge
5. Delete branch

## Git Commands You Should Know

\`\`\`bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Stage and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Update your branch
git pull origin main
git rebase main
\`\`\`

## Handling Merge Conflicts

1. Pull latest changes
2. Resolve conflicts manually
3. Add resolved files
4. Complete merge/rebase

## Best Practices

1. Commit often, push regularly
2. Write descriptive commit messages
3. Review your own code before PR
4. Keep branches short-lived
5. Never commit to main directly

## Code Review Tips

- Be constructive
- Ask questions
- Suggest improvements
- Approve when ready

Master Git and your team will thank you!`,
    excerpt: 'Essential Git workflows and best practices for effective team collaboration.',
    tags: ['git', 'workflow', 'devops', 'tutorial'],
    coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800',
  },
];

// Mock comments
const mockComments = [
  'Great article! This really helped me understand the concept better.',
  'Thanks for sharing! I\'ve been struggling with this for days.',
  'Really well explained. Looking forward to more content like this!',
  'This is exactly what I needed. Bookmarking for future reference.',
  'Awesome tutorial! The examples are super clear.',
  'Nice work! One question though - what about edge cases?',
  'This changed my perspective completely. Thanks!',
  'I learned so much from this post. Keep it up!',
  'Clear and concise. Exactly how tutorials should be written.',
  'Fantastic explanation! Makes total sense now.',
  'This is gold! Sharing with my team.',
  'Very helpful, thank you for taking the time to write this.',
  'I wish I had found this earlier. Would have saved me hours!',
  'Great breakdown of a complex topic.',
  'Bookmarked! This will be super useful for my project.',
];

// Mock replies
const mockReplies = [
  'Glad it helped!',
  'Thanks for the kind words!',
  'Feel free to ask if you have any questions.',
  'Happy to help! Let me know if you need clarification.',
  'I appreciate the feedback!',
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Tag.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create users
    console.log('👥 Creating users...');
    const users = [];
    for (const userData of mockUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      users.push(user);
      console.log(`   Created user: ${user.username}`);
    }

    // Create posts
    console.log('📝 Creating posts...');
    const posts = [];
    for (let i = 0; i < mockPosts.length; i++) {
      const postData = mockPosts[i];
      const author = users[i % users.length];
      
      const wordCount = postData.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      const post = new Post({
        ...postData,
        author: author._id,
        readTime,
        published: true,
      });
      await post.save();
      posts.push(post);
      console.log(`   Created post: ${post.title}`);
    }

    // Add likes to posts (random)
    console.log('❤️  Adding likes to posts...');
    for (const post of posts) {
      const numLikes = Math.floor(Math.random() * 5) + 1;
      const likers = users.sort(() => 0.5 - Math.random()).slice(0, numLikes);
      post.likes = likers.map(u => u._id);
      await post.save();
    }

    // Create comments
    console.log('💬 Creating comments...');
    const comments = [];
    for (const post of posts) {
      const numComments = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < numComments; i++) {
        const commenter = users[Math.floor(Math.random() * users.length)];
        const commentText = mockComments[Math.floor(Math.random() * mockComments.length)];
        
        const comment = new Comment({
          content: commentText,
          author: commenter._id,
          post: post._id,
          parentComment: null,
        });
        await comment.save();
        comments.push(comment);

        // Add some replies
        if (Math.random() > 0.5) {
          const replier = users[Math.floor(Math.random() * users.length)];
          const replyText = mockReplies[Math.floor(Math.random() * mockReplies.length)];
          
          const reply = new Comment({
            content: replyText,
            author: replier._id,
            post: post._id,
            parentComment: comment._id,
          });
          await reply.save();
        }
      }
    }
    console.log(`   Created ${comments.length} comments`);

    // Add likes to comments (random)
    console.log('❤️  Adding likes to comments...');
    for (const comment of comments) {
      if (Math.random() > 0.5) {
        const numLikes = Math.floor(Math.random() * 3) + 1;
        const likers = users.sort(() => 0.5 - Math.random()).slice(0, numLikes);
        comment.likes = likers.map(u => u._id);
        await comment.save();
      }
    }

    // Create/update tags
    console.log('🏷️  Creating tags...');
    const allTags = [...new Set(posts.flatMap(p => p.tags))];
    for (const tagName of allTags) {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-');
      const postCount = posts.filter(p => p.tags.includes(tagName)).length;
      
      const colors = ['#3b49df', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      await Tag.findOneAndUpdate(
        { slug },
        {
          name: tagName,
          slug,
          postCount,
          color,
          description: `Posts about ${tagName}`,
        },
        { upsert: true, new: true }
      );
      console.log(`   Created tag: #${tagName}`);
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   ${users.length} users created`);
    console.log(`   ${posts.length} posts created`);
    console.log(`   ${comments.length}+ comments created`);
    console.log(`   ${allTags.length} tags created`);
    console.log('\n👤 Test User Credentials:');
    console.log('   Username: johndoe');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    console.log('\n🚀 You can now log in and explore the site!');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

