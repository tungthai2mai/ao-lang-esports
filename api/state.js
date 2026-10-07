import { Redis } from "@upstash/redis";
import { timingSafeEqual } from "node:crypto";

const redis = Redis.fromEnv();
const KEY = "tournament:state";
const EMPTY = { teams: [], matches: [], players: [], videos: [] };

function okPass(given) {
  const real = process.env.ADMIN_PASSWORD || "";
  if (!real || typeof given !== "string") return false;
  const a = Buffer.from(given), b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}

function clean(s) {
  const arr = (x) => (Array.isArray(x) ? x.slice(0, 2000) : []);
  return { teams: arr(s?.teams), matches: arr(s?.matches), players: arr(s?.players), videos: arr(s?.videos) };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const data = (await redis.get(KEY)) || EMPTY;
      return res.status(200).json(data);
    }
    if (req.method === "POST") {
      if (!okPass(req.headers["x-admin-password"])) return res.status(401).json({ error: "Sai mật khẩu" });
      if (req.body?.login) return res.status(200).json({ ok: true });
      const state = clean(req.body?.state);
      if (JSON.stringify(state).length > 900000) return res.status(413).json({ error: "Dữ liệu quá lớn" });
      await redis.set(KEY, state);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: "Lỗi máy chủ: " + (e.message || "unknown") });
  }
}
