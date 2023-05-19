const mongoose = require('mongoose');

const { Schema } = mongoose;



//schema
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/]
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ]},
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
