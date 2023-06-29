import { Octokit } from '@octokit/rest';
import { expect } from 'chai';
import ReportGenerator from './ReportGenerator';
import { getGitHubToken, getSampleSarifDirectory, getTestDirectoryFilePath } from './testUtils';
import * as fs from 'fs';

const TOKEN: string = getGitHubToken();

const SIMPLE_TEST_REPOSITORY = {
  repository: 'octodemo/ghas-reporting',
  sarifReportDir: getSampleSarifDirectory('java', 'detailed')
}


describe('ReportGenerator', function () {

  this.timeout(10 * 1000);

  ['octodemo/forrester-webgoat',  'peter-murray/advanced-security-java'].forEach(repository => {
    it(`should generate a report for ${repository}`, async () => {
      const generatorConfig = {
        octokit: new Octokit({auth: TOKEN}),
        repository: repository,
        ref: 'main',
        outputDirectory: getTestDirectoryFilePath(repository),
        templating: {
          name: 'summary'
        }
      }

      const generator = new ReportGenerator(generatorConfig);
      const file = await generator.run();
      expect(file).to.contain(generatorConfig.outputDirectory);
      console.log(`Report generated at ${file}`);
    });
  })


});