const path = require('path')
  , pdfWriter = require('./pdfWriter')
  ;


const html = '<html><body><h1>Hello World</h1></body>'
  , file = path.join(__dirname, '..', 'test.pdf')
;

pdfWriter.save(html, file)
  .then(res => {
    console.log(JSON.stringify(res));
  })
  .catch(err => {
    console.error(err);
  })
;