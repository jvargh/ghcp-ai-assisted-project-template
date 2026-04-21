import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { generateToken } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import type { RegisterInput, LoginInput } from "../validators/auth.js";

const SALT_ROUNDS = 10;

export async function registerUser(input: RegisterInput) {
  const existing = db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .get();

  if (existing) {
    throw new AppError(409, "CONFLICT", "Email already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = db
    .insert(users)
    .values({
      email: input.email,
      passwordHash,
      name: input.name,
      role: input.role,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    })
    .get();

  const token = generateToken({ userId: user.id, role: user.role });

  return { user, token };
}

export async function loginUser(input: LoginInput) {
  const user = db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .get();

  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid email or password");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid email or password");
  }

  const token = generateToken({ userId: user.id, role: user.role });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
}

export function getCurrentUser(userId: number) {
  const user = db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId))
    .get();

  if (!user) {
    throw new AppError(404, "NOT_FOUND", "User not found");
  }

  return user;
}
