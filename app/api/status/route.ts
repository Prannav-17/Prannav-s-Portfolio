import { NextResponse } from "next/server";
// Shows only whether settings exist (never their values). Safe to open in a browser: /api/status
export async function GET() {
  return NextResponse.json({
    groqKeySet: !!process.env.GROQ_API_KEY,
    groqModel: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b (default)",
    geminiKeySet: !!process.env.GEMINI_API_KEY,
    logStoreSet: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
    adminKeySet: !!process.env.ADMIN_KEY,
  });
}
