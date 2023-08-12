const mongoose = require('mongoose');

const { REGEX_URL } = require('../utils/constants');

mongoose.set('runValidators', true);

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v) => REGEX_URL.test(v),
        message: 'Неправильный формат URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('card', cardSchema);
