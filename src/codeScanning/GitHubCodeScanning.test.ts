import { expect } from 'chai';
import { Octokit } from '@octokit/rest';
import GitHubCodeScanning from './GitHubCodeScanning';
import { getGitHubToken } from '../testUtils';

describe('GitHubDependencies', () => {

  const TEST_REPO = {
    owner: 'octodemo',
    repo: 'demo-vulnerabilities-ghas'
  };

  const WEB_GOAT_REPO = {
    owner: 'octodemo',
    repo: 'forrester-webgoat'
  }

  const ghasReportingRepo = {
    owner: 'octodemo',
    repo: 'ghas-reporting'
  };

  const pmAdvanceSecurityJava = {
    owner: 'peter-murray',
    repo: 'advanced-security-java'
  };

  let codeScanning: GitHubCodeScanning;

  before(() => {
    const octokit = new Octokit({ auth: getGitHubToken() });
    codeScanning = new GitHubCodeScanning(octokit);
  });

  describe.skip('getAnalyses()', () => {

    it('should get results', async () => {
      const results = await codeScanning.getAnalyses(TEST_REPO);
      //TODO
    });
  });

  describe('#getLatestAnalysis()', () => {

    it('should get results', async () => {
      const repo = WEB_GOAT_REPO;

      const results = await codeScanning.getLatestAnalysis(repo);
      expect(results?.ageInSeconds).to.be.greaterThan(0);
      expect(results?.scan).to.not.be.undefined;
      expect(results?.scan.url).to.contain(repo.owner);
      expect(results?.scan.url).to.contain(repo.repo);
    });
  });

  describe('#getCodeScanningAnalysis()', () => {

    it('should get results', async () => {
      const repo = WEB_GOAT_REPO;
      const latestAnalysis = await codeScanning.getLatestAnalysis(repo);

      if (!latestAnalysis) {
        throw new Error(`Failed to retrieve a valid code scanning analysis, check that code scanning anf GHAS is enable on tnhe repository ${repo.owner}/${repo.repo}`);
      }

      const analysis = await codeScanning.getCodeScanningAnalysis(repo, latestAnalysis.scan.id);
      expect(analysis?.id).to.equal(latestAnalysis.scan.id);
    });
  });

  describe('#getCodeScanningAnalaysisForSarifId()', () => {

    it('should get SARIF results', async () => {
      const repo = WEB_GOAT_REPO;
      const latestAnalysis = await codeScanning.getLatestAnalysis(repo);

      if (!latestAnalysis) {
        throw new Error(`Failed to retrieve a valid code scanning analysis, check that code scanning anf GHAS is enable on tnhe repository ${repo.owner}/${repo.repo}`);
      }

      const analysis = await codeScanning.getCodeScanningAnalaysisForSarifId(repo, latestAnalysis.scan.sarif_id);
      expect(analysis?.scan.sarif_id).to.equal(latestAnalysis.scan.sarif_id);
      expect(analysis?.sarif).to.not.be.undefined;
    });
  })

  describe('#getLatestCodeQLCodeScanningAnalysis()', () => {

    it('should get results', async () => {
      const repo = WEB_GOAT_REPO;

      const results = await codeScanning.getLatestCodeQLCodeScanningAnalysis(repo)
      expect(results?.ageInSeconds).to.be.greaterThan(0);
      expect(results?.scan).to.not.be.undefined;
      expect(results?.scan.url).to.contain(repo.owner);
      expect(results?.scan.url).to.contain(repo.repo);

      expect(results?.sarif).to.not.be.undefined;
      // fs.writeFileSync('test.sarif', JSON.stringify(results, null, 2));
    });
  })

  describe('#getCodeScanningAnalaysisForSarifId()', () => {

    it('should get results', async () => {
      const repo = WEB_GOAT_REPO;
      const sarifId = '7a58b00e-142e-11ee-873e-ea54b7fd9d9a';

      const results = await codeScanning.getCodeScanningAnalaysisForSarifId(repo, sarifId);
      expect(results?.scan.sarif_id).to.equal(sarifId);
    });
  });


  describe.skip('getOpenCodeScanningAlerts()', () => {

    it(`from ${JSON.stringify(TEST_REPO)}`, async () => {
      const results = await codeScanning.getOpenCodeScanningAlerts(TEST_REPO)
        , tools = results.getTools()
        ;

      expect(tools).to.have.length(1);
      expect(tools[0]).to.equal('CodeQL');
    });

    it(`from ${JSON.stringify(ghasReportingRepo)}`, async () => {
      const results = await codeScanning.getOpenCodeScanningAlerts(ghasReportingRepo)
        , tools = results.getTools()
        ;

      expect(tools).to.have.length(1);
      expect(tools[0]).to.equal('-CodeQL-');
    });

    it(`from ${JSON.stringify(pmAdvanceSecurityJava)}`, async () => {
      const results = await codeScanning.getOpenCodeScanningAlerts(pmAdvanceSecurityJava);

      expect(results.getCodeQLScanningAlerts()).to.have.length(26);//TODO flaky test, sort this out
    });
  });

});