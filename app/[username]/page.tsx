'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { api, Post } from '@/lib/api';
import { authService } from '@/lib/auth';

interface UserData {
  user: {
    _id: string;
    username: string;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    createdAt: string;
  };
  posts: Post[];
}

export default function UserProfile() {
  const params = useParams();
  const username = params.username as string;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  useEffect(() => {
    setMounted(true);
    if (username) {
      loadUser();
    }
  }, [username]);

  const loadUser = async () => {
    try {
      console.log('Loading user:', username);
      const data = await api.getUser(username);
      console.log('User data loaded:', data);
      setUserData(data);
    } catch (error) {
      console.error('Failed to load user:', error);
      console.error('Username attempted:', username);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-gray-600 mb-4">
            The user "@{username}" doesn't exist or the backend server isn't running.
          </p>
          <div className="text-sm text-left bg-white rounded p-4 mb-4">
            <p className="font-semibold mb-2">Troubleshooting:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Make sure the backend server is running: <code className="bg-gray-100 px-1 rounded">npm run server</code></li>
              <li>Check if the database has been seeded: <code className="bg-gray-100 px-1 rounded">npm run seed</code></li>
              <li>Verify the API is accessible at: <code className="bg-gray-100 px-1 rounded">http://localhost:3001</code></li>
            </ol>
          </div>
          <Link 
            href="/" 
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const { user, posts } = userData;

  // Only check after mounted to prevent hydration mismatch
  const currentUser = mounted ? authService.getCurrentUser() : null;
  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4 md:mb-6">
        {/* Cover Image Placeholder */}
        <div className="h-24 md:h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
        
        <div className="px-4 md:px-8 pb-6 md:pb-8">
          {/* Avatar - Overlapping cover */}
          <div className="-mt-10 md:-mt-12 mb-3 md:mb-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl md:text-3xl font-bold border-4 border-white">
                {user.name[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 md:gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {user.name}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-3">@{user.username}</p>
              {user.bio && (
                <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4 max-w-2xl">{user.bio}</p>
              )}
            </div>
            {isOwnProfile && (
              <Link
                href="/settings"
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-center"
              >
                Edit Profile
              </Link>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm border-t border-gray-200 pt-3 md:pt-4">
            <div>
              <span className="font-semibold text-gray-900">{posts.length}</span>
              <span className="text-gray-600 ml-1">{posts.length === 1 ? 'Post' : 'Posts'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">
                {posts.reduce((sum, post) => sum + post.likes.length, 0)}
              </span>
              <span className="text-gray-600 ml-1">Likes</span>
            </div>
            <div>
              <span className="text-gray-600">
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'about'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'posts' ? (
            // Posts Tab Content
            posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-2">No posts yet</p>
                <p className="text-gray-500 text-sm">
                  {isOwnProfile 
                    ? "Start writing your first post!" 
                    : `@${user.username} hasn't published any posts yet`
                  }
                </p>
                {isOwnProfile && (
                  <Link
                    href="/new"
                    className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Post
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )
          ) : (
            // About Tab Content
            <div className="max-w-2xl space-y-6">
              {/* Bio Section */}
              {user.bio && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Bio</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Stats Grid */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                    <div className="text-sm text-gray-600">
                      {posts.length === 1 ? 'Post' : 'Posts'} Published
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {posts.reduce((sum, post) => sum + post.likes.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Likes Received</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {posts.length * 42}
                    </div>
                    <div className="text-sm text-gray-600">Total Views</div>
                  </div>
                </div>
              </div>

              {/* Joined Date */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Member Since</h3>
                <div className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Writing Stats */}
              {posts.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Writing Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Posts</span>
                      <span className="font-semibold text-gray-900">{posts.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Likes</span>
                      <span className="font-semibold text-gray-900">
                        {posts.reduce((sum, post) => sum + post.likes.length, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Likes per Post</span>
                      <span className="font-semibold text-gray-900">
                        {(posts.reduce((sum, post) => sum + post.likes.length, 0) / posts.length).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Reading Time</span>
                      <span className="font-semibold text-gray-900">
                        {posts.reduce((sum, post) => sum + post.readTime, 0)} min
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags Used */}
              {posts.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Favorite Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(posts.flatMap(post => post.tags))).map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${tag}`}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State for About */}
              {!user.bio && posts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-lg mb-2">No additional information</p>
                  <p className="text-gray-500 text-sm">
                    {isOwnProfile 
                      ? "Add a bio in your settings to tell others about yourself!"
                      : `@${user.username} hasn't added a bio yet`
                    }
                  </p>
                  {isOwnProfile && (
                    <Link
                      href="/settings"
                      className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update Profile
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

