'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Tag } from '@/lib/api';

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const data = await api.getTags();
      setTags(data);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Tags</h1>
        <p className="text-gray-600">
          Browse all tags to discover content you're interested in
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No tags found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Link
              key={tag._id}
              href={`/tags/${tag.slug}`}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">#{tag.name}</h2>
                <span
                  className="text-xs px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.postCount} posts
                </span>
              </div>
              {tag.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {tag.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

