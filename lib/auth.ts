import { createHash, timingSafeEqual } from "crypto";
export const token = () => createHash("sha256").update((process.env.ADMIN_KEY ?? "") + "|prannav-admin").digest("hex");
export function same(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export const keyOk = (k: string) => !!process.env.ADMIN_KEY && same(createHash("sha256").update(k).digest("hex"), createHash("sha256").update(process.env.ADMIN_KEY).digest("hex"));
