//TODO handlebars is too simplistic, switch to using Nunjucks for Jinja2 like templating so that we do not need
// to massively change the data structures for the templates we want to use.

const fs = require('fs').promises
  , path = require('path')
  , Handlebars = require('handlebars')
;

function loadData(file) {
  return fs.open(file)
    .then(fileHandle => {
      return fileHandle.readFile()
        .then(content => {
          fileHandle.close();
          return content.toString();
        });
    });
}

Promise.all([
  loadData(path.join(__dirname, '..', 'templates', 'summary.html')),
  loadData(path.join(__dirname, '..', 'report.json'))
]).then(data => {
    const payload = JSON.parse(data[1].toString('utf8'));
    const output = Handlebars.compile(data[0])(payload);
    console.log(output);
  })
  .catch(err => {
    console.error(err);
  });
