const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCardsAll = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  const myId = req.user._id;

  Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка по указанному id ${id} не найдена.`);
      }
      if (card.owner.toString() !== myId) {
        throw new ForbiddenError('Карточка создана другим пользователем. У вас нет прав на её удаление.');
      }
      card.deleteOne()
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || (err.name === 'CastError' && err.path === '_id')) {
        throw new BadRequestError(`Передан некорректный id ${id} карточки.`);
      }
      if (err.statusCode === 403 || err.statusCode === 404) {
        throw err;
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const id = req.params.cardId;
  return Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Передан несуществующий id ${id} карточки.`);
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка.');
      }
      if (err.statusCode === 404) {
        throw err;
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const id = req.params.cardId;

  if (!req.user._id) {
    throw new NotFoundError('Переданы некорректные данные для снятия лайка.');
  }
  return Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Передан несуществующий id ${id} карточки.`);
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' && err.path === '_id') {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка.');
      }
      if (err.statusCode === 404) {
        throw err;
      }
    })
    .catch(next);
};
