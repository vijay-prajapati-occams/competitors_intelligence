import { Schema, model, Types, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  website?: string;
  industry?: string;
  country?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    website: { type: String, trim: true },
    industry: { type: String, trim: true },
    country: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Organization = model<IOrganization>('Organization', organizationSchema);
