import mongoose from 'mongoose';
import { User, IUser } from '../models/User';
import { Organization } from '../models/Organization';
import { Company } from '../models/Company';
import { AppError } from '../utils/AppError';
import { normalizeDomain } from '../utils/normalizeDomain';
import { slugify } from '../utils/slugify';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SafeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organizationId: string;
  organizationName: string;
  createdAt: Date;
  updatedAt: Date;
}

function toSafeUser(user: IUser, organizationName: string): SafeUser {
  return {
    id: user.id as string,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId.toString(),
    organizationName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function generateUniqueSlug(name: string, session: mongoose.ClientSession): Promise<string> {
  const base = slugify(name) || 'organization';
  let slug = base;
  let suffix = 1;

  while (await Organization.exists({ slug }).session(session)) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }

  return slug;
}

export async function registerOrganization(input: RegisterInput): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 409, { email: 'Email already in use' });
  }

  const session = await mongoose.startSession();

  try {
    let safeUser: SafeUser | undefined;
    let tokens: AuthTokens | undefined;

    await session.withTransaction(async () => {
      const slug = await generateUniqueSlug(input.companyName, session);
      const domain = normalizeDomain(input.companyWebsite);

      const [organization] = await Organization.create(
        [
          {
            name: input.companyName,
            slug,
            website: domain,
            createdBy: new mongoose.Types.ObjectId(),
          },
        ],
        { session }
      );

      const [user] = await User.create(
        [
          {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            password: input.password,
            role: 'owner',
            organizationId: organization._id,
          },
        ],
        { session }
      );

      organization.createdBy = user._id;
      await organization.save({ session });

      await Company.create(
        [
          {
            organizationId: organization._id,
            name: input.companyName,
            domain,
          },
        ],
        { session }
      );

      safeUser = toSafeUser(user, organization.name);
      tokens = {
        accessToken: signAccessToken({
          userId: user.id as string,
          organizationId: organization.id as string,
          role: user.role,
        }),
        refreshToken: signRefreshToken({ userId: user.id as string }),
      };
    });

    if (!safeUser || !tokens) {
      throw new AppError('Registration failed', 500);
    }

    return { user: safeUser, tokens };
  } finally {
    await session.endSession();
  }
}

export async function loginUser(input: LoginInput): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  const user = await User.findOne({ email: input.email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const organization = await Organization.findById(user.organizationId);
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  const tokens: AuthTokens = {
    accessToken: signAccessToken({
      userId: user.id as string,
      organizationId: user.organizationId.toString(),
      role: user.role,
    }),
    refreshToken: signRefreshToken({ userId: user.id as string }),
  };

  return { user: toSafeUser(user, organization.name), tokens };
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  return {
    accessToken: signAccessToken({
      userId: user.id as string,
      organizationId: user.organizationId.toString(),
      role: user.role,
    }),
    refreshToken: signRefreshToken({ userId: user.id as string }),
  };
}

export async function getCurrentUser(userId: string): Promise<SafeUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const organization = await Organization.findById(user.organizationId);
  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  return toSafeUser(user, organization.name);
}
