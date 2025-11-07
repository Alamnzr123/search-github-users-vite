export interface UserSummary {
  login: string;
  id: number;
  avatar_url?: string;
  html_url?: string;
}

export interface Repo {
  id: number;
  name: string;
  description?: string | null;
  stargazers_count: number;
  html_url?: string;
}
