import CodeScanningRule from '../sarif/CodeScanningRule';
import Vulnerability from '../dependencies/Vulnerability';
import DependencySet from '../dependencies/DependencySet';
import { SarifFile } from '../sarif/SarifReportFinder';
import CodeScanningResults from '../codeScanning/CodeScanningResults';

export type RuleData = {
  name: string,
  severity: string,
  precision: string,
  kind: string,
  shortDescription: string,
  description: string,
  tags: string[],
  cwe: string[]
}

export type Repo = {
  owner: string,
  repo: string
}

export type CodeScanningRules = {
  [key: string]: CodeScanningRule
}

export type CollectedData = {
  github: Repo
  vulnerabilities: Vulnerability[],
  dependencies: DependencySet[],
  sarifReports: SarifFile[],
  codeScanningOpen: CodeScanningResults,
  codeScanningClosed: CodeScanningResults,
}

export type JsonPayload = {
  github: Repo,
  metadata: {
    created: string,
  }
  sca: {
    dependencies: DependencySummary
    vulnerabilities: {
      total: number
      bySeverity: ServerityToVulnerabilities
    }
  },
  scanning: {
    rules: RuleData[],
    cwe: CWECoverage | {},
    results: CodeScanSummary
  }
}

export type DependencySummary = {
  manifests: {
    processed: Manifest[],
    unprocessed: Manifest[],
  },
  totalDependencies: number,
  dependencies: Dependencies
}

export type Manifest = {
  filename: string,
  path: string,
}

export type Dependencies = {
  [key: string]: Dependency[]
}

export type Dependency = {
  name: string,
  type: string,
  version: string
}

export type ServerityToVulnerabilities = {
  [key: string]: Vulnerability[]
}

export type AlertSummary = {
  tool: string | null,
  name: string,
  state: string,
  created: string,
  url: string,
  rule: {
    id: string
    details?: CodeScanningRule
  }
}

export type SeverityToAlertSummary = {
  [key: string]: AlertSummary[]
}

export type CodeScanResults = {
  total: number,
  scans: SeverityToAlertSummary
}

export type CWECoverage = {
  cweToRules: {[key: string]: RuleData[]},
  cwes: string[]
}

export type CodeScanSummary = {
  open: CodeScanResults,
  closed: CodeScanResults
}