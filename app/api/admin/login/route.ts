import { NextRequest, NextResponse } from "next/server";
import { keyOk, token } from "@/lib/auth";
import { allow } from "@/lib/guard";

export async function POST(req: NextRequest) {
  const ip = "admin:" + (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const back = new URL("/admin", req.url);
  if (allow(ip) !== "ok") { back.searchParams.set("e", "wait"); return NextResponse.redirect(back, 303); }
  const form = await req.formData();
  if (!keyOk(String(form.get("key") ?? ""))) { back.searchParams.set("e", "bad"); return NextResponse.redirect(back, 303); }
  const res = NextResponse.redirect(back, 303);
  res.cookies.set("adm", token(), { httpOnly: true, secure: true, sameSite: "strict", path: "/admin", maxAge: 60 * 60 * 12 });
  return res;
}
