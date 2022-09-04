import { Octokit } from '@octokit/rest';
import { RequestHeaders, RequestParameters } from '@octokit/types';

import {
  QUERY_SECURITY_VULNERABILITIES,
  QUERY_DEPENDENCY_GRAPH,
  VulnerabilityAlert,
  DependencySetData, RepositoryVulnerabilityAlerts, DependencyGraphResult
} from './DependencyTypes';

import Vulnerability from './Vulnerability';
import DependencySet from './DependencySet';


export default class GitHubDependencies {

  private readonly octokit: Octokit;

  constructor(octokit) {
    this.octokit = octokit;
  }

  async getAllVulnerabilities(repo: Repo): Promise<Vulnerability[]> {
    function extractVulnerabilityAlerts(data: RepositoryVulnerabilityAlerts): VulnerabilityAlert[] {
      return data.repository.vulnerabilityAlerts.nodes;
    }

    const data: VulnerabilityAlert[] = await this.getPaginatedQuery<RepositoryVulnerabilityAlerts, VulnerabilityAlert>(
      QUERY_SECURITY_VULNERABILITIES,
      {organizationName: repo.owner, repositoryName: repo.repo},
      'repository.vulnerabilityAlerts.pageInfo',
      extractVulnerabilityAlerts
    );

    return data.map(val => {
      return new Vulnerability(val);
    });
  }

  async getAllDependencies(repo: Repo): Promise<DependencySet[]> {
    function extractDependencySetData(data: DependencyGraphResult): DependencySetData[] {
      return data.repository.dependencyGraphManifests.edges;
    }

    const data = await this.getPaginatedQuery(
      QUERY_DEPENDENCY_GRAPH,
      {organizationName: repo.owner, repositoryName: repo.repo},
      'repository.dependencyGraphManifests.pageInfo',
      extractDependencySetData,
      {accept: 'application/vnd.github.hawkgirl-preview+json'}
    );

    return data.map(node => {
      return new DependencySet(node);
    });
  }

}