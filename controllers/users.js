// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.createUser = (req, res, next) => {
  const {
    email, password
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError({
      message: 'Переданы некорректные почта или пароль.'
    });
  }

  return User.findOne({ email }).then((user) => {
    if (user) {
      throw new ConflictError({ message: 'Пользователь с таким уже Email существует.' });
    }

    return bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
      }));
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError({ message: 'Пользователь с таким уже Email существует.' });
        /* res.status(ERROR_CODE_409).send({
          message: 'Пользователь с таким уже Email существует.' });
        */
      }
      throw new BadRequestError({ message: 'Пользователь с таким уже Email существует.' });
      /* res.status(ERROR_CODE_400).send({
        message: 'Пользователь с таким уже Email существует.' });
      */
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      throw new UnauthorizedError({ message: 'Неправильные почта или пароль.' });
      // res.status(401).send({ message: 'Неправильные почта или пароль.' });
    })
    .catch(next);
};

module.exports.getUsersAll = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      throw new InternalServerError({
        message: 'Произошла ошибка.',
      });
    })
    .catch(next);
  // res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' }));
};

module.exports.getUserId = (req, res, next) => {
  const id = req.params._id;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному id ${id} не найден.`);
        /* return res.status(ERROR_CODE_404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        }); */
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || (err.name === 'CastError' && err.path === '_id')) {
        throw new BadRequestError({
          message: 'Переданы некорректные данные пользователя.'
        });
        /* return res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные пользователя.' });
        */
      }
      throw new InternalServerError({
        message: 'Произошла ошибка.',
      });
    })
    /*
    .catch((err) => {
      if (err.name === 'ValidationError' || (err.name === 'CastError' && err.path === '_id')) {
        return res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные пользователя.' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' });
    }); */
    .catch(next);
};

/*
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные пользователя.' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' });
    });
};
*/

module.exports.getUsersMe = (req, res, next) => {
  const id = req.user._id;

  return User.find({ id })
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      throw new InternalServerError({
        message: 'Произошла ошибка.',
      });
    })
    .catch(next);
  // res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' }));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError({
          message: `Пользователь по указанному id ${id} не найден.`,
        });

        /*
        return res.status(ERROR_CODE_404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        }); */
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({
          message: 'Переданы некорректные данные пользователя.'
        });
        /* return res.status(ERROR_CODE_400).send({
        message: 'Переданы некорректные данные пользователя.' });
       */
      }

      throw new InternalServerError({
        message: 'Произошла ошибка.',
      });
      // return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' });
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError({
          message: `Пользователь по указанному id ${id} не найден.`,
        });
        /*
        return res.status(ERROR_CODE_404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        }); */
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({ message: 'Переданы некорректные данные при обновлении аватара профиля.' });
        /* return res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные при обновлении аватара профиля.' });
        */
      }

      throw new InternalServerError({
        message: 'Произошла ошибка.',
      });
      // return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' });
    })
    .catch(next);
};
