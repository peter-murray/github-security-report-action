export const QUERY_SECURITY_VULNERABILITIES = `
query users($organizationName: String!, $repositoryName: String!, $cursor: String) {

  repository(owner: $organizationName, name: $repositoryName) {
    vulnerabilityAlerts(first: 100, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        createdAt
        dismisser {
          login
          name
        }
        dismissedAt
        dismissReason
        vulnerableManifestFilename
        vulnerableRequirements
        vulnerableManifestPath
        securityVulnerability{
          package {
            ecosystem
            name
          }
          severity
          vulnerableVersionRange
        }
        securityAdvisory{
          databaseId
          id
          summary
          severity
          description
          ghsaId
          identifiers {
            type
            value
          }
          permalink
          publishedAt
        }
      }
    }
  }
}
`;

export type RepositoryVulnerabilityAlerts = {
  repository: {
    vulnerabilityAlerts: {
      totalCount: number,
      pageInfo: {
        hasNextPage: boolean,
        endCursor: string,
      },
      nodes: VulnerabilityAlert[]
    }
  }
}

export type VulnerabilityAlert = {
  id: string,
  createdAt: string,
  dismisser: {
    login: string,
    name: string,
  },
  dismissedAt: string,
  dismissReason: string,
  vulnerableManifestFilename: string,
  vulnerableRequirements: string,
  vulnerableManifestPath
  securityVulnerability: SecurityVulnerability
  securityAdvisory: SecurityAdvisory
}

export type SecurityVulnerability = {
  package: {
    ecosystem: string,
    name: string
  }
  severity: string,
  vulnerableVersionRange: string
}

export type SecurityAdvisory = {
  databaseId: string,
  id: string,
  summary: string
  severity: string,
  description: string
  ghsaId: string,
  identifiers: {
    type: string,
    value: string,
  }
  permalink: string
  publishedAt: string
}

export const QUERY_DEPENDENCY_GRAPH = `
query ($organizationName: String!, $repositoryName: String!, $cursor: String){
  repository(owner: $organizationName name: $repositoryName) {
    name
    dependencyGraphManifests(first: 100, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        node {
          filename
          dependenciesCount
          blobPath
          exceedsMaxSize
          parseable
          dependencies{
            edges {
              node {
                packageName
                packageManager
                requirements
              }
            }
          }
        }
      }
    }
  }
}
`;

export type DependencyGraphResult = {
  repository: {
    name: string,
    dependencyGraphManifests: {
      pageInfo: {
        hasNextPage: boolean,
        endCursor: string,
      },
      totalCount: number,
      edges: DependencySetData[]
    }
  }
}

export type DependencySetData = {
  node: {
    filename: string
    dependenciesCount: number
    blobPath: string
    exceedsMaxSize: boolean
    parseable: boolean
    dependencies: {
      edges: DependencySetDependencyData []
    }
  }
}

export type DependencySetDependencyData = {
  node: {
    packageName: string
    packageManager: string
    requirements: string
  }
}

