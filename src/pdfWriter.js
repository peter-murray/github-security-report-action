const path = require('path')
  , os = require('os')
  , puppeteer = require('puppeteer-core')
  ;

module.exports.save = (html, file) => {

  const fetcher = puppeteer.createBrowserFetcher();
  return fetcher.download('782078')
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

// module.exports.save = (html, file) => {
//   return new Promise((resolve, reject) => {
//     pdf.create(html, getOptions()).toFile(file, (err, res) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(res);
//       }
//     })
//   });
// }
//
// function getOptions() {
//   const isWindows = os.platform() === 'win32'
//     , executableName = isWindows ? 'phantomjs.exe' : 'phantomjs'
//   ;
//
//   return {
//     phantomPath: path.join(__dirname, '..', 'phantomjs', os.platform(), 'bin', executableName)
//   };
// }