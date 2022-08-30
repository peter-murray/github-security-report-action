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
exports.createPDF = void 0;
const os = __importStar(require("os"));
const puppeteer = require('puppeteer-core');
function createPDF(html, file) {
    const fetcher = puppeteer.createBrowserFetcher({ path: os.tmpdir() });
    return fetcher.download('782078') //TODO need to store and inject this
        .then(revisionInfo => {
        return puppeteer.launch({ executablePath: revisionInfo.executablePath })
            .then(browser => {
            return browser.newPage()
                .then(page => {
                return page.setContent(html)
                    .then(() => {
                    return page.pdf({ path: file, format: 'A4' });
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
exports.createPDF = createPDF;
;
