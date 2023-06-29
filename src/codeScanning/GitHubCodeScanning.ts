import { Octokit } from '@octokit/rest';
import { CodeScanningListAlertsForRepoResponseData, Endpoints, CodeScanningListRecentAnalysesResponseData } from '@octokit/types';

import CodeScanningAlert, { CodeScanningData } from './CodeScanningAlert';
import CodeScanningResults from './CodeScanningResults';
import { Repo } from '../github';
import { SarifData } from '../sarif/SarifData';

type listCodeScanningAlertsParameters = Endpoints['GET /repos/:owner/:repo/code-scanning/alerts']['parameters'];

export type LatestAnalysisScanResults = LatestAnalysis & {
  sarif: SarifData
}

export type LatestAnalysis = {
  ageInSeconds: number,
  scan: {
    ref: string,
    commit_sha: string,
    analysis_key: string,
    environment: object,
    category: string,
    error: string,
    created_at: string,
    results_count: number,
    rules_count: number,
    id: number,
    url: string,
    sarif_id: string,
    tool: {
      name: string,
      guid: string | null,
      version: string,
    },
    deletable: boolean,
    warning: string
  }
}

export type LatestAnalysisWithSarif = LatestAnalysis & {
  sarif: object
}

export default class GitHubCodeScanning {

  private readonly octokit: Octokit;

  constructor(octokit) {
    this.octokit = octokit;
  }

  getOpenCodeScanningAlerts(repo: Repo): Promise<CodeScanningResults> {
    return getCodeScanning(this.octokit, repo, 'open');
  }

  getClosedCodeScanningAlerts(repo: Repo): Promise<CodeScanningResults> {
    return getCodeScanning(this.octokit, repo, 'dismissed');
  }

  getAnalyses(repo: Repo, ref?: string, toolName?: string): Promise<CodeScanningListRecentAnalysesResponseData> {
    return getCodeScanningAnalyses(this.octokit, repo, ref, toolName);
  }

  getAnalaysisForSarifId(repo: Repo, sarifId: string): Promise<LatestAnalysis | undefined> {
    //@ts-ignore
    return getCodeScanningAnalysisForSarifId(this.octokit, repo, sarifId)
      .then(createLatestAnalysisData);
  }

  getLatestAnalysis(repo: Repo, ref?: string, toolName?: string): Promise<LatestAnalysis | undefined> {
    //@ts-ignore
    return getCodeScanningAnalyses(this.octokit, repo, ref, toolName)
      .then(createLatestAnalysisData);
  }

  getCodeScanningAnalaysisForSarifId(repo: Repo, sarifId: string): Promise<LatestAnalysisScanResults | undefined> {
    return this.getAnalaysisForSarifId(repo, sarifId)
      .then(latestScanWithSarifResponseBuilder(this.octokit, repo));
  }

  getLatestCodeQLCodeScanningAnalysis(repo: Repo, ref?: string): Promise<LatestAnalysisScanResults | undefined>  {
    return this.getLatestAnalysis(repo, ref, 'CodeQL')
      .then(latestScanWithSarifResponseBuilder(this.octokit, repo));
  }

  getCodeScanningAnalysis(repo: Repo, id: number) {
    return getCodeScanningAnalysis(this.octokit, repo, id, false);
  }

  getCodeScanningAnalysisSarif(repo: Repo, id: number) {
    return getCodeScanningAnalysis(this.octokit, repo, id, true);
  }
}


function latestScanWithSarifResponseBuilder(octokit: Octokit, repo: Repo) {
  return function (data?: LatestAnalysis) {
    if (data?.scan) {
      return getCodeScanningAnalysis(octokit, repo, data.scan.id, true)
        .then(sarif => {
          return {
            ...data,
            sarif: sarif
          }
        });
    }
    return undefined;
  }
}

function createLatestAnalysisData(data?: CodeScanningListRecentAnalysesResponseData): LatestAnalysis | undefined {
  if (data) {
    const latest = data.length > 0 ? data[0] : undefined;
    const created = latest ? latest.created_at : undefined;

    if (latest && created) {
      const ageInMs = Date.now() - Date.parse(created);
      const ageInSeconds = Math.floor(ageInMs / 1000 / 60);
      return {
        ageInSeconds: ageInSeconds,
        //@ts-ignore
        scan: latest
      }
    }
  }

  return undefined;
}

function getCodeScanningAnalysis(octokit: Octokit, repo: Repo, id: number, sarifData: boolean = false) {
  //   console.log(`Fetching analysis ${id} on repo ${repo.owner}/${repo.repo}`);
  const params = {
    ...repo,
    analysis_id: id,
  }

  if (sarifData) {
    params['headers'] = {
      accept: 'application/sarif+json'
    }
  }

  return octokit.rest.codeScanning.getAnalysis(params)
    .catch((error: any) => {
      if (error.status === 404) {
        return undefined;
      }
      throw error;
    })
    .then((results: any) => {
      return results.data;
    });
}


function getCodeScanning(octokit: Octokit, repo: Repo, state: 'open' | 'fixed' | 'dismissed'): Promise<CodeScanningResults> {
  const params: listCodeScanningAlertsParameters = {
    ...repo,
    state: state
  };

  return octokit.paginate('GET /repos/:owner/:repo/code-scanning/alerts', params)
    //@ts-ignore
    .then((alerts: CodeScanningListAlertsForRepoResponseData) => {
      const results: CodeScanningResults = new CodeScanningResults();

      alerts.forEach((alert: CodeScanningData) => {
        results.addCodeScanningAlert(new CodeScanningAlert(alert));
      });

      return results;
    });
}

function getCodeScanningAnalysisForSarifId(octokit: Octokit, repo: Repo, sarifId: string): Promise<CodeScanningListRecentAnalysesResponseData | undefined> {
  return octokit.rest.codeScanning.listRecentAnalyses({
    ...repo,
    sarif_id: sarifId,
  }).catch((error: any) => {
    if (error.status === 404) {
      console.log(`Failed to recall sarif report; ${sarifId}`)
      return undefined;
    }
    throw error;
  })
    .then((results: any) => {
      return results.data;
    });
}

function getCodeScanningAnalyses(octokit: Octokit, repo: Repo, ref: string = 'refs/heads/main', toolName: string = 'CodeQL'): Promise<CodeScanningListRecentAnalysesResponseData> {
  // When 404 should check if the repo exists and error appropriately rather than return undefined?

  return octokit.rest.codeScanning.listRecentAnalyses({
    ...repo,
    ref,
    tool_name: toolName,
    per_page: 100,
  })
    .catch((error: any) => {
      if (error.status === 404) {
        return undefined;
      }
      throw error;
    })
    .then((results: any) => {
      const analyses: CodeScanningListRecentAnalysesResponseData = results.data;
      return analyses;
    });
}
