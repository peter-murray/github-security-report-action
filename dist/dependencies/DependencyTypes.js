"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUERY_DEPENDENCY_GRAPH = exports.QUERY_SECURITY_VULNERABILITIES = void 0;
exports.QUERY_SECURITY_VULNERABILITIES = `
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
exports.QUERY_DEPENDENCY_GRAPH = `
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
