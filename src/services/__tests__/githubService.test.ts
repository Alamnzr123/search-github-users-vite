import { vi, describe, it, expect, beforeEach } from "vitest";
import axios from "axios";
import { searchUsers, getUserRepos, clearCache } from "../githubService";

vi.mock("axios");
const mockedAxios = axios as unknown as { get: vi.Mock };

describe("githubService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    clearCache();
  });

  it("searchUsers returns mapped users and caches result", async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: { items: [ { login: "alice", id: 1, avatar_url: "https://a", html_url: "https://github.com/alice" } ] } });

    const res1 = await searchUsers("alice");
    expect(res1).toHaveLength(1);
    expect(res1[0].login).toBe("alice");

    // Call again, axios should not be called a second time because of cache
    const res2 = await searchUsers("alice");
    expect(res2).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it("getUserRepos returns mapped repos and caches result", async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({ data: [ { id: 10, name: "repo1", description: "d", stargazers_count: 5, html_url: "https://github.com/alice/repo1" } ] });

    const r1 = await getUserRepos("alice");
    expect(r1).toHaveLength(1);
    expect(r1[0].name).toBe("repo1");

    await getUserRepos("alice");
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
