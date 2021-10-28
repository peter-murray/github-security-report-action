import ReportGenerator from './ReportGenerator';

import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

async function run(): Promise<void> {
  try {
    const token = getRequiredInputValue('token');

    const generator = new ReportGenerator({
      repository: getRequiredInputValue('repository'),
      octokit: new Octokit({auth: token, baseUrl: getApiBaseUrl()}),

      sarifReportDirectory: getRequiredInputValue('sarifReportDir'),
      outputDirectory: getRequiredInputValue('outputDir'),

      templating: {
        name: 'summary'
      }
    });

    const file = await generator.run();
    console.log(file);
  } catch (err: Error | any) {
    core.setFailed(err.message);
  }
}

run();

function getRequiredInputValue(key: string): string {
  return core.getInput(key, {required: true});
}

function getApiBaseUrl(): string {
  return process.env['GITHUB_API_URL'] || 'https://api.github.com'
}
