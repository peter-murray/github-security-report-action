import * as os from 'os';

const puppeteer = require('puppeteer-core');

export function createPDF(html: string, file: string): Promise<string> {

  const fetcher = puppeteer.createBrowserFetcher({ path: os.tmpdir() });

  return fetcher.download('782078')//TODO need to store and inject this
    .then(revisionInfo => {
      return puppeteer.launch({
        executablePath: revisionInfo.executablePath,
        // This is required if the user is root, which is the current case in the Codespace
        args: ['--no-sandbox'],
      })
        .then(browser => {
          return browser.newPage()
            .then(page => {
              return page.setContent(html)
                .then(() => {
                  return page.pdf({ path: file, format: 'A4' })
                });
            })
            .then(() => {
              return browser.close();
            });
        })
        .then(() => {
          return file;
        });
    });
};