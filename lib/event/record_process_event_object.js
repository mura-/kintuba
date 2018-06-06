#!/usr/bin/env node

const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

module.exports = class RecordProcessEventObject extends RecordEventObject {
  constructor(event, options = {}) {
    super(event, options);

    if (options.action === undefined) throw new Error('action option is required.');
    if (options.status === undefined) throw new Error('status option is required.');
    if (options.nextStatus === undefined) throw new Error('nextStatus option is required.');

    this.action = { value: options.action };
    this.status = { value: options.status };
    this.nextStatus = { value: options.nextStatus };
    this.error = null;

    this.record.ステータス.value = this.nextStatus.value;
    fixture.update(this.record);
  }

  done() {
    if (this.error) {
      // eslint-disable-next-line no-undef, no-alert
      alert(this.error);
    } else {
      this.rollbackDisallowFields();
      fixture.update(this.record);
    }
  }
};