import { expect } from 'chai';
import GitHubCodeScanning from './GitHubCodeScanning';
import { getOctoKit } from '../testUtils';

const mockedOctoKit = getOctoKit();

describe('GitHubDependencies', () => {

  const testRepo = {
    owner: 'octodemo',
    repo: 'demo-vulnerabilities-ghas'
  };

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
    const octokit = mockedOctoKit;
    codeScanning = new GitHubCodeScanning(octokit);
  });


  describe('getOpenCodeScanningAlerts()', () => {

    it(`from ${JSON.stringify(testRepo)}`, async () => {
      const results = await codeScanning.getOpenCodeScanningAlerts(testRepo)
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

    it (`from ${JSON.stringify(pmAdvanceSecurityJava)}`, async () => {
      const results = await codeScanning.getOpenCodeScanningAlerts(pmAdvanceSecurityJava);

      expect(results.getCodeQLScanningAlerts()).to.have.length(26);//TODO flaky test, sort this out
    });
  });

});
