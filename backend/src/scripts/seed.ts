import mongoose from 'mongoose';
import { env, isProduction } from '../config/env';
import { Organization } from '../models/Organization';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Competitor } from '../models/Competitor';
import { slugify } from '../utils/slugify';

const DEMO_PASSWORD = 'Demo1234!';

async function seed(): Promise<void> {
  if (isProduction) {
    console.error('Refusing to run seed script in production.');
    process.exit(1);
  }

  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding');

  const email = 'owner@demo.com';
  await User.deleteOne({ email });
  const existingOrg = await Organization.findOne({ slug: 'demo-organization' });
  if (existingOrg) {
    await Competitor.deleteMany({ organizationId: existingOrg._id });
    await Company.deleteMany({ organizationId: existingOrg._id });
    await Organization.deleteOne({ _id: existingOrg._id });
  }

  const organization = await Organization.create({
    name: 'Demo Organization',
    slug: slugify('Demo Organization'),
    website: 'demo-organization.com',
    createdBy: new mongoose.Types.ObjectId(),
  });

  const user = await User.create({
    firstName: 'Demo',
    lastName: 'Owner',
    email,
    password: DEMO_PASSWORD,
    role: 'owner',
    organizationId: organization._id,
  });

  organization.createdBy = user._id;
  await organization.save();

  await Company.create({
    organizationId: organization._id,
    name: 'Demo Organization',
    domain: 'demo-organization.com',
    description: 'The main company for the demo organization.',
    industry: 'Software',
    country: 'United States',
  });

  await Competitor.insertMany([
    {
      organizationId: organization._id,
      createdBy: user._id,
      name: 'Competitor A',
      domain: 'competitor-a.com',
      industry: 'Software',
      country: 'United States',
      competitorType: 'direct',
      status: 'active',
      description: 'A leading direct competitor in the market.',
    },
    {
      organizationId: organization._id,
      createdBy: user._id,
      name: 'Competitor B',
      domain: 'competitor-b.com',
      industry: 'Software',
      country: 'Canada',
      competitorType: 'indirect',
      status: 'active',
      description: 'An indirect competitor with overlapping offerings.',
    },
    {
      organizationId: organization._id,
      createdBy: user._id,
      name: 'Competitor C',
      domain: 'competitor-c.com',
      industry: 'Software',
      country: 'United Kingdom',
      competitorType: 'emerging',
      status: 'active',
      description: 'An emerging player to keep an eye on.',
    },
  ]);

  console.log('Seed complete.');
  console.log('Demo login credentials:');
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
