const Card = require('../models/card');
const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } = require('../utils/constants');

module.exports.getCardsAll = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(ERROR_CODE_500).send('Произошла ошибка.'));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send('Переданы некорректные данные при создании карточки.');
      }
      return res.status(ERROR_CODE_500).send('Произошла ошибка.');
    });
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;

  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_404).send({
          message: `Карточка по указанному id ${id} не найдена.`,
        });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_404).send({
          message: `Передан некорректный id ${id} карточки.`,
        });
      }
      return res.status(ERROR_CODE_500).send('Произошла ошибка.');
    });
};

module.exports.likeCard = (req, res) => {
  const id = req.params.cardId;
  return Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_404).send({
          message: `Передан несуществующий id ${id} карточки.`,
        });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send('Переданы некорректные данные для постановки лайка.');
      }
      return res.status(ERROR_CODE_500).send('Произошла ошибка.');
    });
};

module.exports.dislikeCard = (req, res) => {
  const id = req.params.cardId;

  if (!req.user._id) {
    return res.status(ERROR_CODE_404).send({
      message: 'Переданы некорректные данные для снятия лайка.',
    });
  }
  return Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_404).send({
          message: `Передан несуществующий id ${id} карточки.`,
        });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send('Переданы некорректные данные для снятия лайка.');
      }
      return res.status(ERROR_CODE_500).send('Произошла ошибка.');
    });
};
