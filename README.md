# github-security-report-action

A GitHub Action for generating PDF reports for GitHub Advanced Security Code Scan Results and Dependency Vulnerabilities.

The action comes with some predefined HTML templates using [Nunjucks](https://mozilla.github.io/nunjucks/templating.html),
along with the ability to in the future provide your own templates to the renderer.

Due to the nature of CodeQL Analysis this action ideally should be executed after the `github/codeql-action/analyze`
action step, as this will generate the SARIF files on the runner which can be used to identify ALL the rules that were
applied during the analysis. The results stored on your repository will only contain the results that generated an alert. 

## Processing

The action will use the provided token to load all the dependencies, dependency vulnerabilities and the Code Scanning
results for the specified repository. It will then look in the directory specified for any SARIF reports.

With this data it will construct a JSON payload that it then passes into the template system (using Nunjucks a Jinja 
like templating system for JavaScript) and will generate a Summary Report (with more of these to come in the future) 
providing a roll up summary security report in HTML.

Using this HTML, it then passes it over to Puppeteer to render this in a headless Chromium before generating a PDF and 
saving it in the specified directory.

## Parameters

* `token`: A GitHub Personal Access Token with access to `repo` scope
* `sarifReportDir`: The directory to look for SARIF reports (from the CodeQL analyze action this defaults to `../results`)
* `outputDir`: The output directory for the PDF reports, defaults to `github.workspace`
* `repository`: The repository in `<owner>/<repo_name>` form, defaults to `github.repository`


## Templates

Currently the templates are hard coded into the action. There are extension points built into the action that will allow
a future release to provide customization of these templates, via an ability to specify your own.


## Examples

```
name: Generate Security Report
uses: peter-murray/github-security-report-action@v2
with:
  token: ${{ secrets.SECURITY_TOKEN }}
```

Example summary report output:
![Example summary report](summary_report_example.png)


## Standalone execution

For the v2 version, there are bundles that can be used to provide a command line client executable for Linux, MacOS and Windows platforms. The bundles can be downloaded from the [v2 Release](https://github.com/peter-murray/github-security-report-action/releases/tag/v2) assets.

* [Linux bundle](https://github.com/peter-murray/github-security-report-action/releases/download/v2/github-security-report-bundle-linux-x64.zip)
* [MacOS bundle](https://github.com/peter-murray/github-security-report-action/releases/download/v2/github-security-report-bundle-mac-x64.zip)
* [Windows bundle](https://github.com/peter-murray/github-security-report-action/releases/download/v2/github-security-report-bundle-windows-x64.zip)

### Installation
Just download and extact the zip bundle for your target platform. Inside there is a file starting with `github-security-report` with a target platform suffix or .exe extension in the case of Windows.

### Running
Just call the platform executable and pass in the arguments as required. The arguments are the same as that of the GitHub Action, and you can get the full details from invoking the `--help` option on the executable as it will output detailed help

Options:
* `-t`, `--token`: The GitHub Personal Access Token that has the necessary access for security and dependency API endpoints.
* `-r`, `--repository`: The repository that contains the source code, in `<owner>/<repository_name>` form, e.g. `peter-murray/node-hue-api`
* `-s`, `--sarif-directory`: The directory containing the SARIF report files
* `-o`, `--output-directory`: The directory to output the PDF report to. This will be created if it does not exist.

An example of running the MacOS command line executable from the un:
```
$ ./github-security-report-mac-x64 -t <GitHub PAT Token> -r peter-murray/node-hue-api -s <directory containing CodeQL SARIF file(s)>
```
The above command would output a `summary.pdf` file in the current working directory.

## Future improvements

* Add support for selecting reporting templates to the parameters
* Example of extending html templates and using them
 
