import { Octokit } from '@octokit/rest';
import DataCollector from './DataCollector';
import Template from './templating/Template';
import { createPDF } from './pdf/pdfWriter';
import * as path from 'path';

import { mkdirP } from '@actions/io';
import { Logger } from './Logger';

export type ReportGeneratorConfig = {
  repository: string,
  octokit: Octokit,

  sarifReportDirectory: string,
  outputDirectory: string,

  templating: {
    directory: string,
    name: string,
  },

  logger: Logger,
}

export default class ReportGenerator {

  private readonly config: ReportGeneratorConfig;

  constructor(config: ReportGeneratorConfig) {
    this.config = config;
  }

  run(): Promise<string> {
    const config = this.config;
    const collector = new DataCollector(config.octokit, config.repository);

    return collector.getPayload(config.sarifReportDirectory)
      .then(reportData => {
        const reportTemplate = new Template(this.logger, config.templating.directory);
        return reportTemplate.render(reportData.getJSONPayload(), config.templating.name);
      })
      .then(html => {
        return mkdirP(config.outputDirectory)
          .then(() => {
            return createPDF(html, path.join(config.outputDirectory, 'summary.pdf'));
          });
      });
  }

  get logger(): Logger {
    return this.config.logger;
  }
}