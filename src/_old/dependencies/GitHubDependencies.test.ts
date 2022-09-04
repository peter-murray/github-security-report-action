import { expect } from 'chai';
import GitHubDependencies from './GitHubDependencies';

import { Octokit } from '@octokit/rest';
import DependencySet from './DependencySet';
import Dependency from './Dependency';
import { getGitHubToken } from '../testUtils';

describe('GitHubDependencies', function ()  {

  jest.setTimeout(10 * 1000);

  const testRepo = {
    owner: 'octodemo',
    repo: 'demo-vulnerabilities-ghas'
  };

  let ghDeps: GitHubDependencies;

  beforeAll(() => {
    const octokit = new Octokit({auth: getGitHubToken()});
    ghDeps = new GitHubDependencies(octokit);
  });

  describe('#getAllDependencies()', () => {

    it(`from ${JSON.stringify(testRepo)}`, async () => {
      const results: DependencySet[] = await ghDeps.getAllDependencies(testRepo);

      expect(results).to.have.length.greaterThan(0);
      expect(results[0]).to.have.property('count').to.be.greaterThan(0);

      const dep: Dependency = results[0].dependencies[0];
      expect(dep.packageType).to.equal('MAVEN');
    });
  });

  describe('#getAllVulnerabilities()', () => {

    it(`from ${JSON.stringify(testRepo)}`, async () => {
      const results = await ghDeps.getAllVulnerabilities(testRepo);

      expect(results).to.have.length.greaterThan(10);
    });
  });
});