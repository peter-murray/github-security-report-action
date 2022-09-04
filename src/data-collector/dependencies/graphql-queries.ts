export const QUERY_SECURITY_VULNERABILITIES = `
query vulnerabilities($organizationName: String!, $repositoryName: String!, $cursor: String) {

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

        securityAdvisory {
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

export const QUERY_DEPENDENCY_GRAPH = `
query dependencies($organizationName: String!, $repositoryName: String!, $cursor: String){
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



export type GraphQLPageInfo = {
  hasNextPage: boolean,
  endCursor: string,
};

export type QuerySecurityVulnerabilityResult = {
  repository: {
    vulnerabilityAlerts: {
      totalCount: number,
      pageInfo: GraphQLPageInfo,
      nodes: QuerySecurityVulnerabilityResultNode[]
    }
  }
}

export type QuerySecurityVulnerabilityResultNode = {
  id: string,
  createdAt: string, // timestamp
  dismisser?: {
    login: string,
    name: string,
  },
  dismissedAt?: string, //timestamp
  dismissReason?: string,
  vulnerableManifestFilename: string,
  vulnerableRequirements: string,
  vulnerableManidestPath: string,
  securityVulnerability: QuerySecurityVulnerabilityResultNodeSecurityVulnerability,
  securityAdvisory: QuerySecurityVulnerabilityResultNodeSecurityAdvisory,
}

export type QuerySecurityVulnerabilityResultNodeSecurityVulnerability = {
  package: {
    ecosystem: string,
    name: string,
  },
  severity: string, //TODO probably scoped to values HIGH | ...
  vulnerableVersionRange: string,
}

export type QuerySecurityVulnerabilityResultNodeSecurityAdvisory = {
  databaseId: number,
  id: string,
  summary: string,
  severity: string, // HIGH TODO define these
  description: string,
  ghsaId: string,
  identifiers: [
    {
      type: string,
      value: string,
    }
  ],
  permalink: string,
  publishedAt: string, //timestamp
}

export const QUERY_DEPENDENCY_MANIFESTS = `
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
          id
          filename
          dependenciesCount
          blobPath
          exceedsMaxSize
          parseable
        }
      }
    }
  }
}
`;

export type QueryDependencyManifestsResult = {
  repository: {
    name: string,
    dependencyGraphManifests: {
      pageInfo: GraphQLPageInfo,
      totalCount: number,
      edges: {
        nodes: QueryDependencyGraphNode[]
      }
    }
  }
}

export type QueryDependencyGraphNode = {
  id: string,
  filename: string,
  dependenciesCount: number,
  blobPath: string,
  exceedsMaxSize: boolean,
  parsable: boolean,
}

export const QUERY_DEPENDENCY_MANIFEST_DEPENDENCIES = `
query ($organizationName: String!, $repositoryName: String!, $dependencyManifestId: String!, $cursor: String){
  repository(owner: $organizationName name: $repositoryName) {
    name
    dependencyGraphManifests(id: $dependencyManifestId) {
      edges {
        node {
          dependencies(first: 100, after $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            totalCount
            edges {
              nodes {
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

export type QueryDependencyManifestDependenciesResult = {
  repository: {
    name: string,
    dependencyGraphManifests: {
      edges: {
        node: {
          pageInfo: GraphQLPageInfo,
          totalCount: number,
          edges: {
            nodes: QueryDependencyGraphNodeDependency[]
          }
        }
      }
    }
  }
}


export type QueryDependencyGraphNodeDependency = {
  packageName: string,
  packageManager: string,
  requirements: string,
}



//
// export type QueryDependencyGraphResult = {
//   repository: {
//     name: string,
//     dependencyGraphManifests: {
//       pageInfo: GraphQLPageInfo,
//       totalCount: number,
//       edges: {
//         nodes: QueryDependencyGraphNode
//       }
//     }
//   }
// }
//
// export type QueryDependencyGraphNode = {
//   filename: string,
//   dependenciesCount: number,
//   blobPath: string,
//   exceedsMaxSize: boolean,
//   parsable: boolean,
//   dependencies: {
//     edges: {
//       node: QueryDependencyGraphNodeDependency
//     }
//   }
// }
//
// export type QueryDependencyGraphNodeDependency = {
//   packageName: string,
//   packageManager: string,
//   requirements: string,
// }