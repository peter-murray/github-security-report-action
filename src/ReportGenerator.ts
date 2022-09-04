import { Octokit } from '@octokit/rest';
// import DataCollector from '../src/DataCollector';
// import Template from '../src/templating/Template';
// import { createPDF } from '../src/pdf/pdfWriter';
import * as path from 'path';

import { mkdirP } from '@actions/io';

export type ReportGeneratorConfig = {
  repository: string,
  octokit: Octokit,

  sarifReportDirectory: string,
  outputDirectory: string,

  templating: {
    directory?: string,
    name: string,
  }
}

export default class ReportGenerator {

  private readonly config: ReportGeneratorConfig;

  constructor(config: ReportGeneratorConfig) {
    this.config = config;
  }

  run(): Promise<string> {
    const config = this.config;
    //TODO make this work again
    // const collector = new DataCollector(config.octokit, config.repository);

    // return collector.getPayload(config.sarifReportDirectory)
    //   .then(reportData => {
    //     const reportTemplate = new Template(config.templating.directory);
    //     return reportTemplate.render(reportData.getJSONPayload(), config.templating.name);
    //   })
    //   .then(html => {
    //     return mkdirP(config.outputDirectory)
    //       .then(() => {
    //         return createPDF(html, path.join(config.outputDirectory, 'summary.pdf'));
    //       });
    //   });
    return new Promise(res => { res("done")});
  }
}