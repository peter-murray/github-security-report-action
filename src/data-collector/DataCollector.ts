import {Octokit} from "@octokit/rest";
import { GitHubDependencies } from "./dependencies/GitHubDependencies";
import { Repository } from "./types";

export class DataCollector {

  private readonly repo: Repository

  // private readonly octokit
  private readonly githubDependencies: GitHubDependencies;

  constructor(octokit: Octokit, repo: string) {
    if (!repo) {
      throw new Error('A GitHub repository must be provided');
    }

    const parts = repo.split('/')
    this.repo = {
      owner: parts[0],
      repo: parts[1]
    }

    if (!octokit) {
      throw new Error('A GitHub Octokit client needs to be provided');
    }
    // this.octokit = octokit;
    this.githubDependencies = new GitHubDependencies(octokit, this.repo);
  }

  getDependencyVulnerabilities() {
    return this.githubDependencies.getAllVulnerabilities();
  }
}