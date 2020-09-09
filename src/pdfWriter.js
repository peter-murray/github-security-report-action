const path = require('path')
  , os = require('os')
  , pdf = require('html-pdf')
  ;

module.exports.save = (html, file) => {
  return new Promise((resolve, reject) => {
    pdf.create(html, getOptions()).toFile(file, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  });
}

function getOptions() {
  const isWindows = os.platform() === 'win32'
    , executableName = isWindows ? 'phantomjs.exe' : 'phantomjs'
  ;

  return {
    phantomPath: path.join(__dirname, '..', 'phantomjs', os.platform(), 'bin', executableName)
  };
}