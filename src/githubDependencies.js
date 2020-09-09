const Vulnerability = require('./Vulnerability')
  , DependencySet = require('./DependencySet')
  ;

const QUERY_SECURITY_VULNERABILITIES = `
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

const QUERY_DEPENDENCY_GRAPH = `
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
`

module.exports.create = (octokit) => {
  return new GraphQL(octokit)
}

class GraphQL {

  constructor(octokit) {
    this._octokit = octokit;
  }

  get octokit() {
    return this._octokit;
  }

  async getAllVulnerabilities(org, repo) {
    const data = await this.getPaginatedQuery(
      QUERY_SECURITY_VULNERABILITIES,
      {organizationName: org, repositoryName: repo},
      'repository.vulnerabilityAlerts.pageInfo',
      data => { return data.repository.vulnerabilityAlerts.nodes }
    );

    return data.map(val => {return new Vulnerability(val)});
  }

  async getAllDependencies(org, repo) {
    const data = await this.getPaginatedQuery(
      QUERY_DEPENDENCY_GRAPH,
      {organizationName: org, repositoryName: repo},
      'repository.dependencyGraphManifests.pageInfo',
      data => { return data.repository.dependencyGraphManifests.edges },
      {accept: 'application/vnd.github.hawkgirl-preview+json'}
    );

    // console.log(JSON.stringify(data, null, 2));
    return data.map(node => { return new DependencySet(node.node); });
  }

  async getPaginatedQuery(query, parameters, pageInfoPath, extractResultsFn, headers) {
    const octokit = this.octokit
      , results = []
      , queryParameters = Object.assign({cursor: null}, parameters)
    ;

    let hasNextPage = false;
    do {
      const graphqlParameters = buildGraphQLParameters(query, parameters, headers)
        , queryResult = await octokit.graphql(graphqlParameters)
      ;

      const extracted = extractResultsFn(queryResult)
      results.push(...extracted);

      const pageInfo = getObject(queryResult, ...pageInfoPath.split('.'));
      hasNextPage = pageInfo ? pageInfo.hasNextPage : false;
      if (hasNextPage) {
        queryParameters.cursor = pageInfo.endCursor;
      }
    } while (hasNextPage)

    return results;
  }
}

function buildGraphQLParameters(query, parameters, headers) {
  const result = {
    ...(parameters || {}),
    query: query,
  };

  if (headers) {
    result.headers = headers;
  }

  return result;
}

function getObject(target, ...path) {
  if (target !== null && target !== undefined) {
    const value = target[path[0]];

    if (path.length > 1) {
      return getObject(value, ...path.slice(1));
    } else {
      return value;
    }
  }
  return null;
}