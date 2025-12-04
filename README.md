# DEV.to Clone

A full-stack tech blogging platform inspired by DEV.to, built with Next.js, TypeScript, Express, and MongoDB.

## Features

- 📝 Create and publish blog posts with Markdown support
- 🏷️ Tag system for content organization
- 💬 Nested comments and discussions
- ❤️ Like posts and comments
- 🔍 Search functionality
- 👤 User profiles and authentication
- 📱 Responsive design
- ⚡ Real-time updates

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern state management

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally, or a MongoDB Atlas account

### Installation

1. **Clone the repository**

   ```bash
   cd /Users/lukaskoenig/Documents/dev.to
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   The `.env.local` file should already be created with:

   ```env
   MONGODB_URI=mongodb://localhost:27017/devto
   JWT_SECRET=your-secret-key-change-in-production
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start MongoDB**

   If using local MongoDB:

   ```bash
   # macOS with Homebrew
   brew services start mongodb-community

   # Or using mongod directly
   mongod --dbpath /path/to/your/data/directory
   ```

5. **Run the development servers**

   Option A - Run both servers together:

   ```bash
   npm run dev:all
   ```

   Option B - Run separately in different terminals:

   ```bash
   # Terminal 1 - Backend API
   npm run server

   # Terminal 2 - Frontend
   npm run dev
   ```

6. **(Optional) Seed with mock data**

   ```bash
   npm run seed
   ```

   This populates your database with 8 users, 8 posts, and realistic interactions.

   Test login: `johndoe` / `password123`

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Project Structure

```
dev.to/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with navbar
│   ├── page.tsx             # Home page with post feed
│   ├── posts/[id]/          # Post detail page
│   ├── new/                 # Create new post
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── tags/                # Tags pages
│   ├── search/              # Search results
│   └── @[username]/         # User profile
├── components/              # React components
│   ├── Navbar.tsx          # Navigation bar
│   ├── Sidebar.tsx         # Left sidebar
│   └── PostCard.tsx        # Post card component
├── lib/                     # Utility functions
│   ├── api.ts              # API client
│   ├── auth.ts             # Authentication helpers
│   └── utils.ts            # Helper functions
├── server/                  # Express backend
│   ├── index.ts            # Server entry point
│   ├── models/             # Mongoose models
│   │   ├── User.ts
│   │   ├── Post.ts
│   │   ├── Comment.ts
│   │   └── Tag.ts
│   ├── routes/             # API routes
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   ├── comments.ts
│   │   ├── tags.ts
│   │   └── users.ts
│   └── middleware/         # Express middleware
│       └── auth.ts
└── public/                  # Static assets
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts

- `GET /api/posts` - Get all posts (with filtering)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)
- `POST /api/posts/:id/like` - Like/unlike post (auth required)

### Comments

- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment (auth required)
- `PUT /api/comments/:id` - Update comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)

### Tags

- `GET /api/tags` - Get all tags
- `GET /api/tags/:slug` - Get tag by slug
- `POST /api/tags/sync` - Sync tags from posts

### Users

- `GET /api/users/:username` - Get user profile
- `PUT /api/users/:username` - Update user profile (auth required)

## Usage

### Creating an Account

1. Click "Create account" in the navigation bar
2. Fill in your name, username, email, and password
3. Submit the form to create your account

### Writing a Post

1. Log in to your account
2. Click "Create Post" in the navigation
3. Add a title, content, tags, and optionally a cover image
4. Click "Publish Post" to publish immediately, or uncheck to save as draft

### Commenting

1. Navigate to any post
2. Scroll to the comments section
3. Write your comment and click "Submit"
4. Reply to existing comments by clicking "Reply"

### Using Tags

1. Click on any tag to see all posts with that tag
2. Visit the Tags page to browse all available tags
3. When creating a post, add comma-separated tags

## Development

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run server` - Start Express backend server
- `npm run dev:all` - Run both servers concurrently
- `npm run build` - Build Next.js for production
- `npm start` - Start Next.js production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **Frontend**: Create new pages in the `app/` directory or components in `components/`
2. **Backend**: Add new routes in `server/routes/` and models in `server/models/`
3. **API Client**: Update `lib/api.ts` with new API methods

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy

### Backend (Railway/Render)

1. Create a new service
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm run server`
5. Add environment variables

### Database (MongoDB Atlas)

1. Create a cluster on MongoDB Atlas
2. Get your connection string
3. Update `MONGODB_URI` in environment variables

## Security Notes

⚠️ **Important**: Before deploying to production:

- Change the `JWT_SECRET` to a strong random string
- Use HTTPS for all connections
- Enable CORS properly for your domain
- Set up rate limiting
- Add input validation and sanitization
- Use environment variables for all secrets

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Acknowledgments

- Inspired by [DEV.to](https://dev.to)
- Built as a learning project to understand full-stack development
