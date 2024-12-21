import { Schema, model } from 'mongoose';

import uniqueValidator from 'mongoose-unique-validator';

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
  bookCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

schema.plugin(uniqueValidator);

export default model(`Author`, schema);
