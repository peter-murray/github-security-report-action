const fs = require('fs')
  , path = require('path')
  ,  nunjucks = require('nunjucks')
  ;

module.exports = class ReportTemplate {

  constructor(templatesDir) {
    if (!templatesDir) {
      templatesDir = path.join(__dirname, '..', 'templates');
    }
    this._renderer = nunjucks.configure(templatesDir, {autoescape: true})
  }

  get renderer() {
    return this._renderer;
  }

  render(data, template) {
    const content = this.renderer.render(template, data);
    console.log(content);
    return content;
  }
}