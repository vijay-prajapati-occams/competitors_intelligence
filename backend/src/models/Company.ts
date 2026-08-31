import { Schema, model, Types, Document } from 'mongoose';

export interface ICompany extends Document {
  organizationId: Types.ObjectId;
  name: string;
  domain: string;
  logo?: string;
  description?: string;
  industry?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true, lowercase: true },
    logo: { type: String, trim: true },
    description: { type: String, trim: true },
    industry: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Company = model<ICompany>('Company', companySchema);
