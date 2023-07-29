const User = require('../models/user');

module.exports.getUsersAll = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserId = (req, res) => {
  const id = req.params.userId;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        return res.status(400).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (
    !name ||
    !about ||
    !avatar ||
    name.length < 2 ||
    name.length > 30 ||
    about.length < 2 ||
    about.length > 30
  ) {
    return res.status(400).send({
      message: 'Переданы некорректные данные при создании пользователя.',
    });
  }

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user.userId;

  if (!name || !about) {
    return res.status(400).send({
      message: 'Переданы некорректные данные при обновлении профиля.',
    });
  }
  return User.findByIdAndUpdate(id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        return res.status(404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user.userId;

  if (!avatar) {
    return res.status(400).send({
      message: 'Переданы некорректные данные при обновлении профиля.',
    });
  }
  return User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        return res.status(404).send({
          message: `Пользователь по указанному id ${id} не найден.`,
        });
      }
      return res.status(500).send({ message: err.message });
    });
};
