const path = require('path')
  , os = require('os')
  // , pdf = require('html-pdf')
  , puppeteer = require('puppeteer')
  ;

module.exports.save = (html, file) => {

  return puppeteer.launch()
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
    })

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