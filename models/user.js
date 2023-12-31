// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { REGEX_URL } = require('../utils/constants');

mongoose.set('runValidators', true);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто'
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь'
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v) => REGEX_URL.test(v),
        message: 'Неправильный формат URL',
      },
    },
  },
  { versionKey: false }
);

userSchema.statics.findUserByCredentials = function validUserSchema(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль.');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль.');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
