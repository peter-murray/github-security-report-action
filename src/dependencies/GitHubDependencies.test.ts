import { expect } from 'chai';
import GitHubDependencies from './GitHubDependencies';

import DependencySet from './DependencySet';
import Dependency from './Dependency';
import { getOctoKit } from '../testUtils';

const mockedOctoKit = getOctoKit();

describe('GitHubDependencies', function ()  {

  this.timeout(10 * 1000);

  const testRepo = {
    owner: 'octodemo',
    repo: 'demo-vulnerabilities-ghas'
  };

  let ghDeps: GitHubDependencies;

  before(() => {
    const octokit = mockedOctoKit;
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
