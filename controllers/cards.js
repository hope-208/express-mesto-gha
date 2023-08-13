const Card = require('../models/card');
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
    });
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  const myId = req.user._id;

  return Card.findById(id)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(`Карточка по указанному id ${id} не найдена.`));
      }
      if (card.owner.toString() !== myId) {
        return next(new ForbiddenError('Карточка создана другим пользователем. У вас нет прав на её удаление.'));
      }
      return card.deleteOne()
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch((err) => {
      ValidationError(err, next);
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
        return next(new NotFoundError(`Передан несуществующий id ${id} карточки.`));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      ValidationError(err, next);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const id = req.params.cardId;

  return Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(`Передан несуществующий id ${id} карточки.`));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      ValidationError(err, next);
    });
};
