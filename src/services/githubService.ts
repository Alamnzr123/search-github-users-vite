import axios from "axios";
import type { UserSummary, Repo } from "../types/github";

// Simple in-memory cache with TTL
type CacheEntry<T> = { value: T; expiresAt: number };
const cache = {
  users: new Map<string, CacheEntry<UserSummary[]>>(),
  repos: new Map<string, CacheEntry<Repo[]>>()
};

const DEFAULT_TTL = 1000 * 60 * 2; // 2 minutes

function isExpired(entry?: CacheEntry<any>) {
  if (!entry) return true;
  return Date.now() > entry.expiresAt;
}

export async function searchUsers(query: string, ttl = DEFAULT_TTL): Promise<UserSummary[]> {
  const key = query.trim().toLowerCase();
  const cached = cache.users.get(key);
  if (cached && !isExpired(cached)) {
    return cached.value;
  }

  const response = await axios.get(`https://api.github.com/search/users?q=${encodeURIComponent(query)}`);
  const items = response.data.items as any[];
  const mapped = items.map((it) => ({
    login: it.login,
    id: it.id,
    avatar_url: it.avatar_url,
    html_url: it.html_url,
  }));

  cache.users.set(key, { value: mapped, expiresAt: Date.now() + ttl });
  return mapped;
}

export async function getUserRepos(login: string, ttl = DEFAULT_TTL): Promise<Repo[]> {
  const key = login.trim().toLowerCase();
  const cached = cache.repos.get(key);
  if (cached && !isExpired(cached)) {
    return cached.value;
  }

  const response = await axios.get(`https://api.github.com/users/${encodeURIComponent(login)}/repos`);
  const items = response.data as any[];
  const mapped = items.map((it) => ({
    id: it.id,
    name: it.name,
    description: it.description,
    stargazers_count: it.stargazers_count,
    html_url: it.html_url,
  }));

  cache.repos.set(key, { value: mapped, expiresAt: Date.now() + ttl });
  return mapped;
}

// Utility for tests or manual cache clearing
export function clearCache() {
  cache.users.clear();
  cache.repos.clear();
}
