'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { api, Post, Tag } from '@/lib/api';

export default function TagPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [tag, setTag] = useState<Tag | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTag();
    loadPosts();
  }, [slug]);

  const loadTag = async () => {
    try {
      const data = await api.getTag(slug);
      setTag(data);
    } catch (error) {
      console.error('Failed to load tag:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const data = await api.getPosts({ tag: slug });
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/tags"
          className="text-blue-600 hover:underline text-sm mb-2 inline-block"
        >
          ← Back to all tags
        </Link>
        {tag ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl font-bold text-gray-900">#{tag.name}</h1>
              <span
                className="text-sm px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.postCount} posts
              </span>
            </div>
            {tag.description && (
              <p className="text-gray-600 text-lg">{tag.description}</p>
            )}
          </>
        ) : (
          <h1 className="text-4xl font-bold text-gray-900">#{slug}</h1>
        )}
      </div>

      <div className="max-w-3xl">
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
        ) : posts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No posts found with this tag</p>
            <Link
              href="/new"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create the first post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

