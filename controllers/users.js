const User = require('../models/user');

const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } = require('../utils/constants');

module.exports.getUsersAll = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(ERROR_CODE_500).send('Произошла ошибка.'));
};

module.exports.getUserId = (req, res) => {
  const id = req.params._id;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send('Переданы некорректные данные пользователя.');
      }
      return res.status(ERROR_CODE_500).send('Произошла ошибка.');
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send('Переданы некорректные данные пользователя.');
      }
      return res.status(ERROR_CODE_500).send('Произошла ошибка.');
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send('Переданы некорректные данные при обновлении профиля.');
      }
      return res.status(ERROR_CODE_500).send('Произошла ошибка.');
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send('Переданы некорректные данные при обновлении аватара профиля.');
      }
      return res.status(ERROR_CODE_500).send('Произошла ошибка.');
    });
};
