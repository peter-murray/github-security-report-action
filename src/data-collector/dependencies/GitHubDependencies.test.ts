import { expect } from 'chai';
import { GitHubDependencies } from './GitHubDependencies';

import { Octokit } from '@octokit/rest';
import { getGitHubToken, NockUtils } from '../../testUtils';
import { DependencyVulnerability, DismissedBy } from '../model/DependencyVulnerability';

describe('GitHubDependencies', function () {

  jest.setTimeout(15 * 1000);

  let octokit;

  const nockUtils = new NockUtils('GitHubDependencies');

  beforeAll(() => {
    octokit = new Octokit({ auth: getGitHubToken() });
  });

  afterAll(() => {
    nockUtils.reset();
  });

  afterEach(() => {
    nockUtils.afterEachJest();
  })

  // describe('#getAllDependencies()', () => {

  //   it(`from ${JSON.stringify(testRepo)}`, async () => {
  //     const results: DependencySet[] = await ghDeps.getAllDependencies();

  //     expect(results).to.have.length.greaterThan(0);
  //     expect(results[0]).to.have.property('count').to.be.greaterThan(0);

  //     const dep: Dependency = results[0].dependencies[0];
  //     expect(dep.packageType).to.equal('MAVEN');
  //   });
  // });

  describe('#getAllVulnerabilities()', () => {

    const testRepo = {
      owner: 'octodemo',
      repo: 'demo-vulnerabilities-ghas',
      expected: {
        total: 307
      }
    };

    it('should get vulnerabilities', async() => {
      nockUtils.beforeEachJest(`getAllVulnerabilities-${testRepo.owner}-${testRepo.repo}`);

      const ghDeps = new GitHubDependencies(octokit, testRepo);
      const results = await ghDeps.getAllVulnerabilities();

      expect(results).to.have.length(testRepo.expected.total);

      const depVuln: DependencyVulnerability = results[0];

      expect(depVuln.created).to.equal('2020-04-17T18:20:39Z');
      expect(depVuln.severity).to.equal('MODERATE');
      expect(depVuln.published).to.equal('2019-02-22T20:54:27Z');
      expect(depVuln.link).to.equal('https://github.com/advisories/GHSA-wh77-3x4m-4q9g');

      const vuln = depVuln.vulnerability;
      expect(vuln.packageEcosystem).to.equal('NPM');
      expect(vuln.packageName).to.equal('bootstrap');
      expect(vuln.severity).to.equal('MODERATE');
      expect(vuln.versionRange).to.equal('>= 4.0.0, < 4.3.1');

      const advisory = depVuln.advisory;
      expect(advisory.githubSecurityAdvisoryId).to.equal('GHSA-wh77-3x4m-4q9g');
      expect(advisory.summary).to.equal('Moderate severity vulnerability that affects bootstrap and bootstrap-sass');
      expect(advisory.description).to.equal('In Bootstrap 4 before 4.3.1 and Bootstrap 3 before 3.4.1, XSS is possible in the tooltip or popover data-template attribute. For more information, see: https://blog.getbootstrap.com/2019/02/13/bootstrap-4-3-1-and-3-4-1/');
      expect(advisory.severity).to.equal('MODERATE');
      expect(advisory.published).to.equal('2019-02-22T20:54:27Z');


      expect(depVuln.isDismissed).to.be.true;
      //@ts-ignore
      const dissmissal: DismissedBy = depVuln.dismissedBy;
      expect(dissmissal.reason).to.equal('Risk is tolerable to this project');
      expect(dissmissal.user.login).to.equal('andrekolodochka');
      expect(dissmissal.at).to.equal('2021-11-11T00:26:04Z');
    });

    it.each([
      testRepo,
      {
        owner: 'octodemo',
        repo: 'pm-test-5006',
        expected: {
          total: 1
        }
      }
    ])(`validate vulnerabilites for repository $owner/$repo`, async ({ owner, repo, expected }) => {
      nockUtils.beforeEachJest(`getAllVulnerabilities-${owner}-${repo}`);

      const ghDeps = new GitHubDependencies(octokit, { owner: owner, repo: repo });
      const results = await ghDeps.getAllVulnerabilities();

      expect(results).to.have.length(expected.total);
    });
  });

});