const Card = require('../models/card');

module.exports.getCardsAll = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  if (!name || !link) {
    return res.status(400).send({
      message: 'Переданы некорректные данные при создании карточки.',
    });
  }
  return Card.create({ name, link, owner: req.user.userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;

  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: `Карточка по указанному id ${id} не найдена.`,
        });
      }
      return res.send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  const id = req.params.cardId;

  if (!req.user.userId) {
    return res.status(400).send({
      message: 'Переданы некорректные данные для постановки лайка.',
    });
  }
  return Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user.userId } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: `Передан несуществующий id ${id} карточки.`,
        });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        return res.status(404).send({
          message: `Передан несуществующий id ${id} карточки.`,
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  const id = req.params.cardId;

  if (!req.user.userId) {
    return res.status(400).send({
      message: 'Переданы некорректные данные для снятия лайка.',
    });
  }
  return Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user.userId } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: `Передан несуществующий id ${id} карточки.`,
        });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      }
      return res.status(500).send({ message: err.message });
    });
};
