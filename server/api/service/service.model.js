'use strict';

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var ServiceSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  endpoint: String,
  draw2dContent: [Schema.Types.Mixed]
});

export default mongoose.model('Service', ServiceSchema);
