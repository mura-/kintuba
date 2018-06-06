#!/usr/bin/env node

module.exports = class Record {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }

  getId() {
    const allows = ['app.record.detail', 'app.record.edit', 'app.record.print'];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    return this.data && isAllow() ? this.data.$id.value : null;
  }

  get() {
    const allows = [
      'app.record.detail',
      'app.record.create',
      'app.record.edit',
      'app.record.print',
    ];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    return this.data && isAllow() ? JSON.parse(JSON.stringify({ record: this.data })) : null;
  }

  set(data) {
    const allows = ['app.record.create', 'app.record.edit'];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    if (isAllow()) {
      this.data = JSON.parse(JSON.stringify(data.record));
    }
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  setFieldShown(fieldCode, isShown) {
    // 何もしない
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  setGroupFieldOpen(fieldCode, isOpen) {
    // 何もしない
  }
};