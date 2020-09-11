
module.exports = class CodeScanningAlert {

  constructor(data) {
    this._data = data;
  }

  get id() {
    return this._data.number;
  }

  get url() {
    return this._data.html_url;
  }

  get created() {
    return this._data.created_at;
  }

  get dismissed() {
    if (this._data.dismissed_at) {
      return {
        at: this._data.dismissed_at,
        reason: this._data.dismissed_reason,
        by: {
          login: this._data.dismissed_by.login,
          type: this._data.dismissed_by.type,
          id: this._data.dismissed_by.id,
          avatar: this._data.dismissed_at.avatar_url,
          url: this._data.dismissed_at.html_url,
        },
      }
    }
    return null;
  }

  get severity() {
    return this.rule ? this.rule.severity : null;
  }

  get state() {
    return this._data.state;
  }

  get rule() {
    if (this._data.rule) {
      return this._data.rule
    }
    return null;
  }

  get ruleId() {
    return this.rule ? this.rule.id : null;
  }

  get ruleDescription() {
    return this.rule ? this.rule.description : null;
  }

  get toolName() {
    return this._data.tool ? this._data.tool.name : null;
  }

  get toolVersion() {
    return this._data.tool ? this._data.tool.version : null;
  }
}