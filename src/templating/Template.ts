import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../Logger';

const nunjucks = require('nunjucks');

export default class Template {

  private readonly renderer;

  private readonly templatesDir: string;

  private readonly logger: Logger;

  constructor(logger: Logger, templatesDir: string) {
    this.templatesDir = templatesDir;
    this.logger = logger;
    this.renderer = nunjucks.configure(this.templatesDir, { autoescape: true })
  }

  render(data, template): string {
    const resolvedTemplateFilename = this.getValidatedTemplateFileName(template);
    const content = this.renderer.render(resolvedTemplateFilename, data);
    //TODO consider providing intermediate output
    return content;
  }

  getValidatedTemplateFileName(name): string {
    this.logger.info(`Looking for template file '${name}' in templates directory '${this.templatesDir}'`);

    const templateDirectoryExists = fs.existsSync(this.templatesDir);

    if (templateDirectoryExists) {
      if (fs.existsSync(path.join(this.templatesDir, name))) {
        this.logger.info(`  exact match found.`);
        return name;
      } else {
        this.logger.info(`  checking for supported file type extensions...`);
        // Try our known supported extensions
        const found = ['html', 'j2'].filter(extension => {
          return fs.existsSync(path.join(this.templatesDir, `${name}.${extension}`));
        });

        if (found.length > 0) {
          this.logger.info(`  matched: ${name}.${found[0]}`);
          return `${name}.${found[0]}`;
        }
      }
    }

    this.logger.warn(`  No matching templates found for ${name} in ${this.templatesDir}`);
    this.logger.warn(`    template directory exists? ${templateDirectoryExists}`);
    if (templateDirectoryExists) {
      this.logger.warn(`    template directory contents:`);
      fs.readdirSync(this.templatesDir).forEach(file => {
        this.logger.warn(`      * ${file}`);
      });
    }

    throw new Error(`Failed to resolve a template file from directory ${this.templatesDir} with name "${name}"`);
  }
}