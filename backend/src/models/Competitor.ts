import { Schema, model, Types, Document } from 'mongoose';
import { CompetitorType, CompetitorStatus } from '../types';

export interface ICompetitor extends Document {
  organizationId: Types.ObjectId;
  name: string;
  domain: string;
  logo?: string;
  description?: string;
  industry?: string;
  country?: string;
  competitorType: CompetitorType;
  status: CompetitorStatus;
  notes?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const competitorSchema = new Schema<ICompetitor>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true, lowercase: true },
    logo: { type: String, trim: true },
    description: { type: String, trim: true },
    industry: { type: String, trim: true },
    country: { type: String, trim: true },
    competitorType: {
      type: String,
      enum: ['direct', 'indirect', 'emerging', 'benchmark'],
      required: true,
      default: 'direct',
    },
    status: {
      type: String,
      enum: ['active', 'paused'],
      required: true,
      default: 'active',
    },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

competitorSchema.index({ organizationId: 1, domain: 1 }, { unique: true });
competitorSchema.index({ organizationId: 1, name: 'text', domain: 'text' });

export const Competitor = model<ICompetitor>('Competitor', competitorSchema);
