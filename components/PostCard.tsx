'use client';

import Link from 'next/link';
import { Post } from '@/lib/api';
import { formatDistanceToNow } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow overflow-hidden">
      {post.coverImage && (
        <Link href={`/posts/${post._id}`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </Link>
      )}

      <div className="p-5">
        {/* Author info */}
        <div className="flex items-center gap-2 mb-3">
          <Link href={`/${post.author?.username || 'unknown'}`}>
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author?.name || 'User'}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                {post.author?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </Link>
          <div className="text-sm">
            <Link
              href={`/${post.author?.username || 'unknown'}`}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              {post.author?.name || 'Unknown User'}
            </Link>
            <p className="text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt))}
            </p>
          </div>
        </div>

        {/* Title and excerpt */}
        <Link href={`/posts/${post._id}`} className="block mb-3">
          <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 mb-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
          )}
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
              <span>❤️</span>
              <span>{post.likes.length}</span>
            </button>
            <Link
              href={`/posts/${post._id}#comments`}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <span>💬</span>
              <span>Comments</span>
            </Link>
          </div>
          <div className="text-xs">
            {post.readTime} min read
          </div>
        </div>
      </div>
    </article>
  );
}

