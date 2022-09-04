import { Octokit } from "@octokit/rest";
import { RequestHeaders, RequestParameters } from '@octokit/types';
import { GraphQLPageInfo } from "./graphql-queries";


export type QueryParameters = {
  cursor?: string,
  [key: string]: any
}

export type LooseObject = {
  [key: string]: any;
}


export class GraphQLRequest {

  private readonly octokit: Octokit;

  constructor(octokit: Octokit) {
    this.octokit = octokit;
  }

  async getPaginatedQuery<T, Y>(
    query: string,
    parameters: LooseObject,
    pageInfoPath: string,
    extractResultsFn: (val: T) => Y[],
    headers?: RequestHeaders): Promise<Y[]> {

    const octokit = this.octokit
      , results: Y[] = []
      , queryParameters: QueryParameters = Object.assign({ cursor: undefined }, parameters)
      ;

    let hasNextPage: boolean = false;
    do {
      const graphqlParameters: RequestParameters = buildGraphQLParameters(query, queryParameters, headers)
        , queryResult: any = await octokit.graphql(graphqlParameters)
        ;

      // @ts-ignore
      const extracted: Y = extractResultsFn(queryResult);
      // @ts-ignore
      results.push(...extracted);

      const pageInfo: GraphQLPageInfo = getObject(queryResult, ...pageInfoPath.split('.'));
      hasNextPage = pageInfo ? pageInfo.hasNextPage : false;

      if (hasNextPage) {
        queryParameters.cursor = pageInfo.endCursor;
      }
    } while (hasNextPage);

    return results;
  }
}

function buildGraphQLParameters(query: string, parameters?: Object, headers?: RequestHeaders): RequestParameters {
  const result: RequestParameters = {
    ...(parameters || {}),
    query: query,
  };

  if (headers) {
    result.headers = headers;
  }

  return result;
}

function getObject(target: LooseObject, ...path: string[]) {
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