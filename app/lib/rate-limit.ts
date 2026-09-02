type RateLimitRecord = {
  count: number;
  expiresAt: number;
};

const requests = new Map<string, RateLimitRecord>();

export function rateLimit(identifier: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();

  const record = requests.get(identifier);

  if (!record || record.expiresAt < now) {
    requests.set(identifier, {
      count: 1,
      expiresAt: now + windowMs,
    });

    return {
      success: true,
      remaining: limit - 1,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
    };
  }

  record.count++;

  return {
    success: true,
    remaining: limit - record.count,
  };
}
