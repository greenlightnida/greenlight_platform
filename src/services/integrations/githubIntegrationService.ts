/**
 * GitHub Integration Service
 * Handles integration with GitHub API for repository management
 */

export interface GitHubConfig {
  token: string;
  baseUrl: string;
  timeout: number;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  labels: Array<{ name: string }>;
  assignees: Array<{ login: string }>;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface GitHubPullRequest extends GitHubIssue {
  merged_at?: string;
  base?: { ref: string };
  head?: { ref: string };
}

class GitHubIntegrationService {
  private config: GitHubConfig = {
    token: '',
    baseUrl: 'https://api.github.com',
    timeout: 10000
  };

  /**
   * Initialize the GitHub integration service
   * @param token
   */
  async initialize(token: string): Promise<void> {
    this.config.token = token;
    console.log('GitHub Integration Service initialized');
  }

  /**
   * Search for issues and pull requests
   * @param query
   */
  async searchIssues(query: string): Promise<GitHubIssue[]> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/search/issues?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `token ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Failed to search GitHub issues:', error);
      return [];
    }
  }

  /**
   * Get repository information
   * @param owner
   * @param repo
   */
  async getRepository(owner: string, repo: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/repos/${owner}/${repo}`,
        {
          headers: {
            'Authorization': `token ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get repository:', error);
      return null;
    }
  }

  /**
   * Update service configuration
   * @param config
   */
  updateConfig(config: Partial<GitHubConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get service configuration
   */
  getConfig(): GitHubConfig {
    return { ...this.config };
  }
}
