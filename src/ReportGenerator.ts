import { Octokit } from '@octokit/rest';
import DataCollector from './DataCollector';
import Template from './templating/Template';
import { createPDF } from './pdf/pdfWriter';
import * as path from 'path';

import { mkdirP } from '@actions/io';

export type ReportGeneratorConfig = {
  repository: string,
  ref: string,

  sarifId?: string,

  octokit: Octokit,

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
    const collector = new DataCollector(config.octokit, config.repository, config.ref, config.sarifId);

    return collector.getPayload()
      .then(reportData => {
        const reportTemplate = new Template(config.templating.directory);
        return reportTemplate.render(reportData.getJSONPayload(), config.templating.name);
      })
      .then(html => {
        return mkdirP(config.outputDirectory)
          .then(() => {
            return createPDF(html, path.join(config.outputDirectory, 'summary.pdf'));
          });
      });
  }
}