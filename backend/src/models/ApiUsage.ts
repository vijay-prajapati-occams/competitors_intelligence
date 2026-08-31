import { Schema, model, Types, Document } from 'mongoose';

export interface IApiUsage extends Document {
  organizationId: Types.ObjectId;
  provider: string;
  endpoint: string;
  requests: number;
  estimatedCost: number | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const apiUsageSchema = new Schema<IApiUsage>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    provider: { type: String, required: true, trim: true },
    endpoint: { type: String, required: true, trim: true },
    requests: { type: Number, required: true, default: 1 },
    estimatedCost: { type: Number, default: null },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

apiUsageSchema.index({ organizationId: 1, provider: 1, createdAt: -1 });
apiUsageSchema.index({ organizationId: 1, 'metadata.competitorId': 1, createdAt: -1 });

export const ApiUsage = model<IApiUsage>('ApiUsage', apiUsageSchema);
