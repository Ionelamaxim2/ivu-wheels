import fs from "fs";
import path from "path";
import crypto from "crypto";

export type StoredUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  passwordSalt: string;
  passwordHash: string;
};

const usersFilePath = path.join(process.cwd(), "data", "users.json");

function ensureUsersFile() {
  const dir = path.dirname(usersFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, "[]", { encoding: "utf-8" });
  }
}

export function readUsers(): StoredUser[] {
  ensureUsersFile();
  try {
    const raw = fs.readFileSync(usersFilePath, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data as StoredUser[];
    return [];
  } catch {
    return [];
  }
}

export function writeUsers(users: StoredUser[]) {
  ensureUsersFile();
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), {
    encoding: "utf-8",
  });
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(params: {
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
}): StoredUser {
  const users = readUsers();
  const existing = users.find(
    (u) => u.email.toLowerCase() === params.email.toLowerCase()
  );
  if (existing) {
    throw new Error("USER_EXISTS");
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const passwordSalt = crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto
    .scryptSync(params.password, passwordSalt, 64)
    .toString("hex");

  const user: StoredUser = {
    id,
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
    createdAt,
    passwordSalt,
    passwordHash,
  };

  users.push(user);
  writeUsers(users);
  return user;
}

export function verifyPassword(user: StoredUser, password: string): boolean {
  const hash = crypto
    .scryptSync(password, user.passwordSalt, 64)
    .toString("hex");
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(user.passwordHash, "hex")
  );
}
