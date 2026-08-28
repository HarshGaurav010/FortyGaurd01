// Server-side in-memory rate limiter (Token Bucket / Sliding Window)
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute

export function checkRateLimit(clientIp: string = 'global-user'): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = ipMap.get(clientIp);

  if (!record || now > record.resetTime) {
    ipMap.set(clientIp, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetMs: WINDOW_MS };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetMs: record.resetTime - now };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetMs: record.resetTime - now };
}
