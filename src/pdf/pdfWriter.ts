import * as path from 'path';
import * as fs from 'fs';

import * as browsers from '@puppeteer/browsers';
import * as puppeteerCore from 'puppeteer-core';

export async function createPDF(html: string, file: string): Promise<string> {
  const cacheDir = path.resolve(path.join('.cache', 'puppeteer'));

  const installedBrowser = await browsers.install({
    browser: browsers.Browser.CHROME,
    // buildId: '117.0.5859.0',
    buildId: '114.0.5735.133',
    cacheDir,
  });

  // console.log(JSON.stringify(installedBrowser, null, 2));

  const executablePath = path.join(installedBrowser.path, getChromeLinux64Path());
  const executableStats = fs.statSync(executablePath);
  if (!executableStats.isFile()) {
    throw new Error(`Could not find browser executable at ${executablePath}`);
  }

  const browser = await puppeteerCore.launch({
    headless: true,
    executablePath: executablePath,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  return browser.newPage()
    .then(page => {
      return page.setContent(html)
        .then(() => {
          return page.pdf({ path: file, format: 'A4' })
        });
    })
    .then(() => {
      return browser.close();
    })
    .then(() => {
      return file;
    });
}

function getChromeLinux64Path() {
  return path.join('chrome-linux64', 'chrome');
}