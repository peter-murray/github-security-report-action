import { expect } from 'chai';
import ReportGenerator from './ReportGenerator';
import { getOctoKit, getSampleSarifDirectory, getTestDirectoryFilePath } from './testUtils';

const mockedOctoKit = getOctoKit();

const SIMPLE_TEST_REPOSITORY = {
  repository: 'octodemo/ghas-reporting',
  sarifReportDir: getSampleSarifDirectory('java', 'detailed')
}

const PM_AS_JAVA = {
  repository: 'peter-murray/advanced-security-java',
  sarifReportDir: getSampleSarifDirectory('peter-murray', 'advanced-security-java', 'with-extensions')
}

describe('ReportGenerator', function () {

  this.timeout(10 * 1000);

  [SIMPLE_TEST_REPOSITORY, PM_AS_JAVA].forEach(config => {
    it(`should generate a report for ${config.repository}`, async () => {
      const generatorConfig = {
        octokit: mockedOctoKit,
        repository: config.repository,

        sarifReportDirectory: config.sarifReportDir,
        outputDirectory: getTestDirectoryFilePath(config.repository),

        templating: {
          name: 'summary'
        }
      }

      const generator = new ReportGenerator(generatorConfig);
      const file = await generator.run();
      expect(file).to.contain(generatorConfig.outputDirectory);
      //TODO need to store an expected result
    });
  })


});