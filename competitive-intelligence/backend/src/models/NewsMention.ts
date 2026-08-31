import { Schema, model, Types, Document } from 'mongoose';
import { NewsCategory, NewsSentiment, SourceReliability } from '../types';

export interface INewsMentionMetadata {
  relevanceScore: number;
  confidence: number;
  sourceReliability: SourceReliability;
}

export interface INewsMention extends Document {
  organizationId: Types.ObjectId;
  competitorId: Types.ObjectId;

  title: string;
  description?: string;
  sourceName?: string;
  sourceDomain: string;
  sourceUrl: string;
  normalizedUrl: string;
  contentHash: string;
  imageUrl?: string;

  publishedAt?: Date;
  discoveredAt: Date;

  category: NewsCategory;
  sentiment: NewsSentiment;

  searchQuery: string;
  provider: string;
  providerId?: string;

  isRead: boolean;
  isBookmarked: boolean;
  isArchived: boolean;

  metadata: INewsMentionMetadata;

  createdAt: Date;
  updatedAt: Date;
}

const NEWS_CATEGORIES: NewsCategory[] = [
  'funding',
  'partnership',
  'acquisition',
  'product_launch',
  'leadership',
  'award',
  'expansion',
  'customer_win',
  'legal',
  'security',
  'pricing',
  'marketing',
  'research',
  'general',
];

const newsMentionSchema = new Schema<INewsMention>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    competitorId: { type: Schema.Types.ObjectId, ref: 'Competitor', required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    sourceName: { type: String, trim: true },
    sourceDomain: { type: String, required: true, trim: true, lowercase: true },
    sourceUrl: { type: String, required: true, trim: true },
    normalizedUrl: { type: String, required: true },
    contentHash: { type: String, required: true },
    imageUrl: { type: String, trim: true },

    publishedAt: { type: Date },
    discoveredAt: { type: Date, required: true, default: () => new Date() },

    category: { type: String, enum: NEWS_CATEGORIES, required: true, default: 'general' },
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], required: true, default: 'neutral' },

    searchQuery: { type: String, required: true },
    provider: { type: String, required: true, default: 'serpapi' },
    providerId: { type: String },

    isRead: { type: Boolean, required: true, default: false },
    isBookmarked: { type: Boolean, required: true, default: false },
    isArchived: { type: Boolean, required: true, default: false },

    metadata: {
      relevanceScore: { type: Number, required: true, default: 0 },
      confidence: { type: Number, required: true, default: 0 },
      sourceReliability: { type: String, enum: ['high', 'medium', 'unknown'], required: true, default: 'unknown' },
    },
  },
  { timestamps: true }
);

newsMentionSchema.index({ organizationId: 1, competitorId: 1, normalizedUrl: 1 }, { unique: true });
newsMentionSchema.index({ organizationId: 1, competitorId: 1, contentHash: 1 });
newsMentionSchema.index({ organizationId: 1, publishedAt: -1 });
newsMentionSchema.index({ organizationId: 1, competitorId: 1, publishedAt: -1 });
newsMentionSchema.index({ organizationId: 1, category: 1 });
newsMentionSchema.index({ organizationId: 1, isRead: 1 });
newsMentionSchema.index({ organizationId: 1, title: 'text', description: 'text' });

export const NewsMention = model<INewsMention>('NewsMention', newsMentionSchema);
