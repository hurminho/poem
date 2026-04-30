import { NextResponse } from "next/server";
import { signOutAction } from "@/lib/auth/actions";

export async function POST() {
  await signOutAction();
  return NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  );
}
