import CodeScanningAlert from './CodeScanningAlert';

export default class CodeScanningResults {

  private data: CodeScanningAlert[];

  constructor() {
    this.data = [];
  }

  addCodeScanningAlert(alert: CodeScanningAlert) {
    this.data.push(alert);
  }

  getTools(): string[] {
    const result: string[] = [];

    this.data.forEach(alert => {
      const toolName = alert.toolName;

      if (toolName && result.indexOf(toolName) === -1) {
        result.push(toolName);
      }
    })

    return result;
  }

  getCodeQLScanningAlerts(): CodeScanningAlert[] {
    return this.data.filter(value => {
      //TODO this is now reporting CodeQL command-line toolchain as the name of the tool!
      // Need to follow up on this with GHAS team on what to expect in the future.
      return `${value.toolName}`.toLowerCase().startsWith('codeql');
    });
  }
}