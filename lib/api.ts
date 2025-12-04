const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  likes: string[];
  readTime: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    name: string;
    avatar?: string;
  };
  post: string;
  parentComment?: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  postCount: number;
}

class ApiClient {
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Auth
  async register(data: {
    username: string;
    email: string;
    password: string;
    name: string;
  }) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  }

  // Posts
  async getPosts(params?: {
    tag?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const response = await fetch(
      `${API_URL}/api/posts?${queryParams.toString()}`,
      {
        headers: this.getHeaders(false),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    return response.json();
  }

  async getPost(id: string): Promise<Post> {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      headers: this.getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    return response.json();
  }

  async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    tags?: string[];
    published?: boolean;
  }): Promise<Post> {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create post');
    }

    return response.json();
  }

  async updatePost(
    id: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      tags?: string[];
      published?: boolean;
    }
  ): Promise<Post> {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update post');
    }

    return response.json();
  }

  async deletePost(id: string) {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete post');
    }

    return response.json();
  }

  async likePost(id: string) {
    const response = await fetch(`${API_URL}/api/posts/${id}/like`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to like post');
    }

    return response.json();
  }

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    const response = await fetch(`${API_URL}/api/comments/post/${postId}`, {
      headers: this.getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return response.json();
  }

  async createComment(data: {
    content: string;
    postId: string;
    parentCommentId?: string;
  }): Promise<Comment> {
    const response = await fetch(`${API_URL}/api/comments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create comment');
    }

    return response.json();
  }

  async deleteComment(id: string) {
    const response = await fetch(`${API_URL}/api/comments/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }

    return response.json();
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    const response = await fetch(`${API_URL}/api/tags`);

    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    return response.json();
  }

  async getTag(slug: string): Promise<Tag> {
    const response = await fetch(`${API_URL}/api/tags/${slug}`);

    if (!response.ok) {
      throw new Error('Failed to fetch tag');
    }

    return response.json();
  }

  // Users
  async getUser(username: string) {
    try {
      console.log('Fetching user from:', `${API_URL}/api/users/${username}`);
      const response = await fetch(`${API_URL}/api/users/${username}`);

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      return response.json();
    } catch (error) {
      console.error('Network error or API error:', error);
      throw error;
    }
  }
}

export const api = new ApiClient();

