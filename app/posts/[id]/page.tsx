'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Post, Comment } from '@/lib/api';
import { authService } from '@/lib/auth';
import { formatDate } from '@/lib/utils';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadPost();
    loadComments();
  }, [postId]);

  const loadPost = async () => {
    try {
      const data = await api.getPost(postId);
      setPost(data);
      setLikeCount(data.likes.length);
      
      if (currentUser) {
        setLiked(data.likes.includes(currentUser.id));
      }
    } catch (error) {
      console.error('Failed to load post:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await api.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const result = await api.likePost(postId);
      setLiked(result.liked);
      setLikeCount(result.likes);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!commentContent.trim()) return;

    try {
      await api.createComment({
        content: commentContent,
        postId,
        parentCommentId: replyTo || undefined,
      });

      setCommentContent('');
      setReplyTo(null);
      loadComments();
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        {/* Cover Image */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-80 object-cover"
          />
        )}

        <div className="p-8">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-6">
            <Link href={`/${post.author?.username || 'unknown'}`}>
              {post.author?.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author?.name || 'User'}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-medium">
                  {post.author?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </Link>
            <div>
              <Link
                href={`/${post.author?.username || 'unknown'}`}
                className="font-semibold text-gray-900 hover:text-blue-600"
              >
                {post.author?.name || 'Unknown User'}
              </Link>
              <p className="text-sm text-gray-600">
                Posted on {formatDate(new Date(post.createdAt))}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                liked
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">{liked ? '❤️' : '🤍'}</span>
              <span className="font-medium">{likeCount}</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md">
              <span className="text-xl">💬</span>
              <span className="font-medium">{comments.length} Comments</span>
            </div>
            <div className="ml-auto text-sm text-gray-600">
              {post.readTime} min read
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div id="comments" className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6">
          Discussion ({comments.length})
        </h2>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add to the discussion..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-2">
              {replyTo && (
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel Reply
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-3">
              Log in to join the discussion
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Log In
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-l-2 border-gray-200 pl-4">
              <div className="flex items-start gap-3">
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                    {comment.author.name[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        href={`/${comment.author.username}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {comment.author.name}
                      </Link>
                      <span className="text-sm text-gray-500">
                        {formatDate(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <button className="text-gray-600 hover:text-red-600">
                      ❤️ {comment.likes.length}
                    </button>
                    {isAuthenticated && (
                      <button
                        onClick={() => setReplyTo(comment._id)}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        Reply
                      </button>
                    )}
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="flex items-start gap-3">
                          {reply.author.avatar ? (
                            <img
                              src={reply.author.avatar}
                              alt={reply.author.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                              {reply.author.name[0].toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Link
                                  href={`/${reply.author.username}`}
                                  className="font-semibold text-sm text-gray-900 hover:text-blue-600"
                                >
                                  {reply.author.name}
                                </Link>
                                <span className="text-xs text-gray-500">
                                  {formatDate(new Date(reply.createdAt))}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}

