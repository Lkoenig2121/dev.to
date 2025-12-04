'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { api, Post } from '@/lib/api';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await api.getPosts();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to DEV Community
            </h1>
            <p className="text-gray-600">
              A constructive and inclusive social network for software developers
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error</p>
              <p>{error}</p>
              <p className="text-sm mt-2">
                Run <code className="bg-red-100 px-1 rounded">npm run server</code> in a separate terminal to start the backend server.
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                No posts yet. Be the first to create one!
              </p>
              <a
                href="/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Post
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </main>

        {/* Right sidebar - could add more widgets here */}
        <aside className="hidden xl:block w-80">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-16">
            <h3 className="font-bold text-lg mb-3">#discuss</h3>
            <p className="text-sm text-gray-600">
              Discussion threads targeting the whole community
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
