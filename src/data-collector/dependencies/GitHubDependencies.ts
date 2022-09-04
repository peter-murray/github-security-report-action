import { Octokit } from "@octokit/rest";
import { DependencyVulnerability } from "../model/DependencyVulnerability";
import { Repository } from '../types';
import { GraphQLRequest } from './graphql';
import { QuerySecurityVulnerabilityResult, QuerySecurityVulnerabilityResultNode, QUERY_SECURITY_VULNERABILITIES } from "./graphql-queries";

export class GitHubDependencies {

  private readonly repo: Repository

  private readonly graphql: GraphQLRequest;

  constructor(octokit: Octokit, repo: Repository) {
    if (!octokit) {
      throw new Error('A GitHub Octokit client needs to be provided');
    }
    this.graphql = new GraphQLRequest(octokit);

    if (!repo) {
      throw new Error('A GitHub repository must be provided');
    }
    this.repo = repo;
  }

  // async getAllDependencies() {
  //   // function extractDependencySetData(data: DependencyGraphResult): DependencySetData[] {
  //   //   return data.repository.dependencyGraphManifests.edges;
  //   // }

  //   // const data = await this.graphql.getPaginatedQuery(
  //   //   QUERY_DEPENDENCY_GRAPH,
  //   //   {organizationName: repo.owner, repositoryName: repo.repo},
  //   //   'repository.dependencyGraphManifests.pageInfo',
  //   //   extractDependencySetData,
  //   //   {accept: 'application/vnd.github.hawkgirl-preview+json'}
  //   // );

  //   // return data.map(node => {
  //   //   return new DependencySet(node);
  //   // });
  //   const data: Query
  // }

  async getAllVulnerabilities(): Promise<DependencyVulnerability[]> {
    const data: QuerySecurityVulnerabilityResultNode[] =
      await this.graphql.getPaginatedQuery<QuerySecurityVulnerabilityResult, QuerySecurityVulnerabilityResultNode>(
        QUERY_SECURITY_VULNERABILITIES,
        {
          organizationName: this.repo.owner,
          repositoryName: this.repo.repo
        },
        'repository.vulnerabilityAlerts.pageInfo',
        extractVulnerabilityAlerts
      );

    return data.map(val => {
      return new DependencyVulnerability(val);
    });
  }
}

function extractVulnerabilityAlerts(data: QuerySecurityVulnerabilityResult): QuerySecurityVulnerabilityResultNode[] {
  return data.repository.vulnerabilityAlerts.nodes;
}