'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, Tag } from '@/lib/api';

export default function Sidebar() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const data = await api.getTags();
      setTags(data.slice(0, 10));
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-64 sticky top-16 h-screen overflow-y-auto pb-8">
      <div className="space-y-6">
        {/* Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <nav className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <span className="text-xl">🏠</span>
              <span className="font-medium">Home</span>
            </Link>
            <Link
              href="/tags"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <span className="text-xl">🏷️</span>
              <span className="font-medium">Tags</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <span className="text-xl">ℹ️</span>
              <span className="font-medium">About</span>
            </Link>
          </nav>
        </div>

        {/* Popular Tags */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-bold text-lg mb-3">Popular Tags</h3>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <Link
                  key={tag._id}
                  href={`/tags/${tag.slug}`}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span className="text-gray-700">#{tag.name}</span>
                  <span className="text-xs text-gray-500">{tag.postCount}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-bold text-lg mb-2">DEV Community</h3>
          <p className="text-sm text-gray-600 mb-3">
            A constructive and inclusive social network for software developers.
          </p>
          <Link
            href="/register"
            className="block w-full py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </aside>
  );
}

