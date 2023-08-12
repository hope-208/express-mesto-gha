const Card = require('../models/card');
// const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

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
      ValidationError(err, next);

      /* if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } */
    });
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  const myId = req.user._id;

  Card.findById(id)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(`Карточка по указанному id ${id} не найдена.`));
      }
      if (card.owner.toString() !== myId) {
        next(new ForbiddenError('Карточка создана другим пользователем. У вас нет прав на её удаление.'));
      }
      card.deleteOne()
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch((err) => {
      ValidationError(err, next);
      /*

      if (err.name === 'CastError') {
        throw new BadRequestError(`Передан некорректный id ${id} карточки.`);
      }
      */
      /*
      if (err.statusCode === 403 || err.statusCode === 404) {
        throw err;
      } next(); */
    });
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
      ValidationError(err, next);
      /*
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка.');
      }
      if (err.statusCode === 404) {
        throw err;
      }
      next(); */
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const id = req.params.cardId;

  if (!req.user._id) {
    throw new NotFoundError('Переданы некорректные данные для снятия лайка.');
  }
  return Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Передан несуществующий id ${id} карточки.`);
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      ValidationError(err, next);
      /*
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка.');
      }
      if (err.statusCode === 404) {
        throw err;
      }
      */
    });
};
