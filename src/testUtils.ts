import * as path from 'path';
import { Octokit } from '@octokit/rest';
import {
  RequestParameters
} from "@octokit/types";
import { stubObject } from "ts-sinon";
import * as fs from 'fs';
import {
  QUERY_SECURITY_VULNERABILITIES, QUERY_DEPENDENCY_GRAPH
} from "./dependencies/DependencyTypes";

export function getTestDirectoryFilePath(...filePath): string {
  const args = [__dirname, '..', '_tmp', ...filePath];
  return path.join(...args);
}

export function getSampleDataDirectory(...dir): string {
  const args = [__dirname, '..', 'samples', ...dir];
  return path.join(...args);
}

export function getSampleSarifDirectory(...dir): string {
  const args = [__dirname, '..', 'samples', 'sarif', ...dir];
  return path.join(...args);
}

export function getSampleReportJsonDirectory(...dir): string {
  const args = [__dirname, '..', 'samples', 'reportJson', ...dir];
  return path.join(...args);
}

export function getGitHubToken(): string {
  const token = process.env['GH_TOKEN'];

  if (!token) {
    throw new Error('GitHub Token was not set for environment variable "GH_TOKEN"');
  }
  return token;
}

export function getOctoKit(): Octokit {
  const mockedOctoKit = stubObject<Octokit>(new Octokit({ auth: "TOKEN" }));

  mockedOctoKit.paginate.callsFake((route, params) => {
    const parameters : RequestParameters = typeof params == "string" ? JSON.parse(params!) : params;
    const responseFile : string = path.join(__dirname, '..', 'samples', 'mocks', 'code-scanning', 'alerts', parameters.owner as string, parameters.repo as string, (parameters.state as string) + ".json");

    // Generate response from mock file:
    const response = JSON.parse(fs.readFileSync(responseFile, 'utf8'));
    return new Promise((resolve, reject) => {
      resolve(response);
    });
  });
  mockedOctoKit.graphql.callsFake((request, query, options?) => {
    const parameters : RequestParameters = typeof request == "string" ? JSON.parse(request!) : request

    const organizationName = parameters.organizationName as string;
    const repositoryName = parameters.repositoryName as string;
    const isVulnerabilityQuery = parameters.query as string == QUERY_SECURITY_VULNERABILITIES;
    const isDependecyQuery = parameters.query as string == QUERY_DEPENDENCY_GRAPH;
    const queryType = isVulnerabilityQuery ? "vulnerabilities" : "dependencies";

    const responseFile = path.join(__dirname, '..', 'samples', 'mocks', 'graphql', organizationName, repositoryName, queryType + ".json");

    // Generate response from mock file:
    const response = JSON.parse(fs.readFileSync(responseFile, 'utf8'));
    return new Promise((resolve, reject) => {
      resolve(response);
    });
  });

  return mockedOctoKit;
}