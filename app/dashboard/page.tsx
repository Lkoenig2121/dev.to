'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { api, Post } from '@/lib/api';
import { formatDistanceToNow } from '@/lib/utils';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof authService.getCurrentUser>>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'stats'>('published');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadUserPosts();
  }, [router]);

  const loadUserPosts = async () => {
    try {
      if (!user) {
        console.warn('No user found, cannot load posts');
        setLoading(false);
        return;
      }
      
      console.log('Loading posts for user:', user.username);
      
      if (!user.username) {
        console.error('Username is missing from user object:', user);
        setLoading(false);
        return;
      }
      
      const data = await api.getUser(user.username);
      console.log('User data loaded:', data);
      console.log('Posts found:', data.posts?.length || 0);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Show error in console for debugging
      console.error('User object was:', user);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.deletePost(postId);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const publishedPosts = posts.filter(p => p.published);
  const draftPosts = posts.filter(p => !p.published);
  const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
  const totalViews = posts.length * 42; // Mock data

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your posts and view your stats</p>
        </div>
        <Link
          href="/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Create Post
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Posts</div>
          <div className="text-3xl font-bold text-gray-900">{posts.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Published</div>
          <div className="text-3xl font-bold text-green-600">{publishedPosts.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Likes</div>
          <div className="text-3xl font-bold text-red-600">{totalLikes}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Views</div>
          <div className="text-3xl font-bold text-blue-600">{totalViews}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('published')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'published'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Published ({publishedPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'drafts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Drafts ({draftPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Stats
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Published Posts Tab */}
          {activeTab === 'published' && (
            <div>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : publishedPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">You haven't published any posts yet</p>
                  <Link
                    href="/new"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Post
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {publishedPosts.map((post) => (
                    <div
                      key={post._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            href={`/posts/${post._id}`}
                            className="text-xl font-bold text-gray-900 hover:text-blue-600 mb-2 block"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>Published {formatDistanceToNow(new Date(post.createdAt))}</span>
                            <span>•</span>
                            <span>❤️ {post.likes.length} likes</span>
                            <span>•</span>
                            <span>{post.readTime} min read</span>
                          </div>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Link
                            href={`/edit/${post._id}`}
                            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Drafts Tab */}
          {activeTab === 'drafts' && (
            <div>
              {draftPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No drafts</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {draftPosts.map((post) => (
                    <div
                      key={post._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                              Draft
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            Last edited {formatDistanceToNow(new Date(post.updatedAt))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Link
                            href={`/edit/${post._id}`}
                            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">Total Posts</div>
                    <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {publishedPosts.length} published, {draftPosts.length} drafts
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">Engagement</div>
                    <div className="text-2xl font-bold text-gray-900">{totalLikes}</div>
                    <div className="text-sm text-gray-500 mt-1">Total likes received</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Most Popular Posts</h3>
                <div className="space-y-3">
                  {publishedPosts
                    .sort((a, b) => b.likes.length - a.likes.length)
                    .slice(0, 5)
                    .map((post) => (
                      <div
                        key={post._id}
                        className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
                      >
                        <Link
                          href={`/posts/${post._id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 flex-1"
                        >
                          {post.title}
                        </Link>
                        <div className="text-sm text-gray-600 ml-4">
                          ❤️ {post.likes.length}
                        </div>
                      </div>
                    ))}
                  {publishedPosts.length === 0 && (
                    <p className="text-gray-600 text-center py-4">No posts yet</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tags Used</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(posts.flatMap((post) => post.tags))
                  ).map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-gray-600">No tags yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

