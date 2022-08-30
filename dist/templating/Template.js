"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = require('path'), nunjucks = require('nunjucks');
// Default templates as part of the action
const EMBEDDED_TEMPLATES = path.join(__dirname, '..', '..', 'templates');
class Template {
    constructor(templatesDir) {
        if (!templatesDir) {
            this.templatesDir = EMBEDDED_TEMPLATES;
        }
        else {
            this.templatesDir = templatesDir;
        }
        this.renderer = nunjucks.configure(this.templatesDir, { autoescape: true });
    }
    render(data, template) {
        const resolvedTemplateFilename = this.getValidatedTemplateFileName(template);
        const content = this.renderer.render(resolvedTemplateFilename, data);
        //TODO consider providing intermediate output
        return content;
    }
    getValidatedTemplateFileName(name) {
        if (fs.existsSync(path.join(this.templatesDir, name))) {
            return name;
        }
        else {
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
exports.default = Template;
