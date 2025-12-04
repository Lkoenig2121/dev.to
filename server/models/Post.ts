import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  readTime: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    readTime: {
      type: Number,
      default: 1,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster tag queries
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

