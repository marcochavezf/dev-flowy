'use strict';

import mongoose from 'mongoose';

var NodeSchema = new mongoose.Schema({
  draw2dId: String,
  code: {
    type: String,
    default: 'function nameFn(params) {\n\treturn params;\n}'
  },
  info: String,
  active: Boolean
});

export default mongoose.model('Node', NodeSchema);
