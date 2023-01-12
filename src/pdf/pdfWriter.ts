import * as os from 'os';

const puppeteer = require('puppeteer-core');

export function createPDF(html: string, file: string): Promise<string> {

  const fetcher = puppeteer.createBrowserFetcher({path: os.tmpdir()});

  return fetcher.download('782078')//TODO need to store and inject this
    .then(revisionInfo => {
      return puppeteer.launch({
          executablePath: revisionInfo.executablePath,
          headless: true,
          devtools: true,
          args: [
            '--ignore-certificate-errors',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
          ]
        })
        .then(browser => {
          return browser.newPage()
            .then(page => {
              return page.setContent(html)
                .then(() => {
                  return page.pdf({path: file, format: 'A4'})
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
