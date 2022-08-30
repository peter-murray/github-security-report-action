"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DependencyTypes_1 = require("./DependencyTypes");
const Vulnerability_1 = __importDefault(require("./Vulnerability"));
const DependencySet_1 = __importDefault(require("./DependencySet"));
class GitHubDependencies {
    constructor(octokit) {
        this.octokit = octokit;
    }
    getAllVulnerabilities(repo) {
        return __awaiter(this, void 0, void 0, function* () {
            function extractVulnerabilityAlerts(data) {
                return data.repository.vulnerabilityAlerts.nodes;
            }
            const data = yield this.getPaginatedQuery(DependencyTypes_1.QUERY_SECURITY_VULNERABILITIES, { organizationName: repo.owner, repositoryName: repo.repo }, 'repository.vulnerabilityAlerts.pageInfo', extractVulnerabilityAlerts);
            return data.map(val => {
                return new Vulnerability_1.default(val);
            });
        });
    }
    getAllDependencies(repo) {
        return __awaiter(this, void 0, void 0, function* () {
            function extractDependencySetData(data) {
                return data.repository.dependencyGraphManifests.edges;
            }
            const data = yield this.getPaginatedQuery(DependencyTypes_1.QUERY_DEPENDENCY_GRAPH, { organizationName: repo.owner, repositoryName: repo.repo }, 'repository.dependencyGraphManifests.pageInfo', extractDependencySetData, { accept: 'application/vnd.github.hawkgirl-preview+json' });
            return data.map(node => {
                return new DependencySet_1.default(node);
            });
        });
    }
    getPaginatedQuery(query, parameters, pageInfoPath, extractResultsFn, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const octokit = this.octokit, results = [], queryParameters = Object.assign({ cursor: null }, parameters);
            let hasNextPage = false;
            do {
                const graphqlParameters = buildGraphQLParameters(query, parameters, headers), queryResult = yield octokit.graphql(graphqlParameters);
                // @ts-ignore
                const extracted = extractResultsFn(queryResult);
                // @ts-ignore
                results.push(...extracted);
                const pageInfo = getObject(queryResult, ...pageInfoPath.split('.'));
                hasNextPage = pageInfo ? pageInfo.hasNextPage : false;
                if (hasNextPage) {
                    queryParameters.cursor = pageInfo.endCursor;
                }
            } while (hasNextPage);
            return results;
        });
    }
}
exports.default = GitHubDependencies;
function buildGraphQLParameters(query, parameters, headers) {
    const result = Object.assign(Object.assign({}, (parameters || {})), { query: query });
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
        }
        else {
            return value;
        }
    }
    return null;
}
