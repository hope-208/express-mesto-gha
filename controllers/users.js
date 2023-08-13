const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch((err) => {
      ValidationError(err, next);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

module.exports.getUsersAll = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const id = req.params._id;

  return User.findById(id)
    .then((user) => {
      if (user) { return res.send({ data: user }); }
      return next(new NotFoundError(`Пользователь по указанному id ${id} не найден.`));
    })
    .catch((err) => {
      ValidationError(err, next);
    });
};

module.exports.getUsersMe = (req, res, next) => {
  const id = req.user._id;

  return User.findById(id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) { return res.send({ data: user }); }
      return next(new NotFoundError(`Пользователь по указанному id ${id} не найден.`));
    })
    .catch((err) => {
      ValidationError(err, next);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) { return res.send({ data: user }); }
      return next(new NotFoundError(`Пользователь по указанному id ${id} не найден.`));
    })
    .catch((err) => {
      ValidationError(err, next);
    });
};
