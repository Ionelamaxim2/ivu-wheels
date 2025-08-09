import { NextResponse } from "next/server";
import { createUser } from "@/lib/userDb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body || {};
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }
    const user = createUser({ email, password, firstName, lastName });
    const safe = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    };
    return NextResponse.json({ user: safe }, { status: 201 });
  } catch (err: any) {
    if (err?.message === "USER_EXISTS") {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
