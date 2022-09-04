import * as fs from 'fs';

const path = require('path')
  , nunjucks = require('nunjucks')
  ;

// Default templates as part of the action
const EMBEDDED_TEMPLATES = path.join(__dirname, '..', '..', 'templates');

export default class Template {

  private readonly renderer;

  private readonly templatesDir: string;

  constructor(templatesDir?: string) {
    if (!templatesDir) {
      this.templatesDir = EMBEDDED_TEMPLATES;
    } else {
      this.templatesDir = templatesDir;
    }

    this.renderer = nunjucks.configure(this.templatesDir, {autoescape: true})
  }

  render(data, template): string {
    const resolvedTemplateFilename = this.getValidatedTemplateFileName(template);
    const content = this.renderer.render(resolvedTemplateFilename, data);
    //TODO consider providing intermediate output
    return content;
  }

  getValidatedTemplateFileName(name): string {
    if (fs.existsSync(path.join(this.templatesDir, name))) {
      return name;
    } else {
      // Try our known supported extensions
      const found = ['html', 'j2'].filter(extension => {
        return fs.existsSync(path.join(this.templatesDir, `${name}.${extension}`));
      });

      if (found.length > 0) {
        return `${name}.${found[0]}`;
      }
    }

    throw new Error(`Failed to resolve a template file from directory ${this.templatesDir} with name "${name}"`);
  }
}