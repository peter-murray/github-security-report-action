import * as fs from 'fs';
import { expect } from 'chai';
import SarifReport from './SarifReport';
import { getSampleSarifDirectory } from '../testUtils';

describe('SarifReport', function () {

  this.timeout(10 * 1000);

  it(`should parse javascript file`, async () => {
    const file = getSampleSarifDirectory('javascript', 'basic', 'test.sarif');
    const contents = JSON.parse(fs.readFileSync(file).toString());
    const report: SarifReport = new SarifReport(contents);

    expect(report.cweList).to.have.length(54);
    expect(report.cweList).to.contain.members(['cwe-020', 'cwe-022']);
  });

  it(`should parse basic java file`, async () => {
    const file = getSampleSarifDirectory('java', 'basic', 'java.sarif');
    const contents = JSON.parse(fs.readFileSync(file).toString());
    const report: SarifReport = new SarifReport(contents);

    expect(report.cweList).to.have.length(30);
    expect(report.cweList).to.contain.members(['cwe-022', 'cwe-829']);
  });

  it(`should parse detailed java file`, async () => {
    const file = getSampleSarifDirectory('java', 'detailed', 'java.sarif');
    const contents = JSON.parse(fs.readFileSync(file).toString());
    const report: SarifReport = new SarifReport(contents);

    expect(report.cweList).to.have.length(30);
    expect(report.cweList).to.contain.members(['cwe-022', 'cwe-829']);
  });

  it(`should parse csharp file`, async () => {
    const file = getSampleSarifDirectory('csharp', 'csharp.sarif');
    const contents = JSON.parse(fs.readFileSync(file).toString());
    const report: SarifReport = new SarifReport(contents);

    expect(report.cweList).to.have.length(69);
    expect(report.cweList).to.contain.members(['cwe-022', 'cwe-829']);
  });
});