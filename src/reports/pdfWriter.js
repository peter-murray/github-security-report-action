const puppeteer = require('puppeteer-core');

module.exports.save = (html, file) => {

  const fetcher = puppeteer.createBrowserFetcher();
  return fetcher.download('782078')//TODO need to store and inject this
    .then(revisionInfo => {
      return puppeteer.launch({executablePath: revisionInfo.executablePath})
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
}