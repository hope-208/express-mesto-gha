const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getCardsAll = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      throw new InternalServerError('Произошла ошибка.');
    })
    .catch(next);
  /*
   .catch((err) => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' })); */
};

/*
// controllers/cards.js

module.exports.createCard = (req, res) => Card.create({
  name: req.body.name,
  link: req.body.link,
  owner: req.user._id // используем req.user
});
*/

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
        /* return res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные при создании карточки.' }); */
      }
      throw new InternalServerError('Произошла ошибка.');
      // return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;
  const ownerId = req.user._id;
  const userCardId = req.params.owner;
  if (ownerId === !userCardId) {
    throw new UnauthorizedError('Карточка создана другим пользователем. У вас нет прав на её удаление.');
    /*
    return res.status(ERROR_CODE_401).send({
      message: `Карточка создана другим пользователем. У вас нет прав на её удаление.`,
    }); */
  } else {
    Card.findByIdAndRemove(id)
      .then((card) => {
        if (!card) {
          throw new NotFoundError(`Карточка по указанному id ${id} не найдена.`);
        /*
        return res.status(ERROR_CODE_404).send({
          message: `Карточка по указанному id ${id} не найдена.`,
        }); */
        }
        return res.send({ data: card });
      })
      .catch((err) => {
        if (err.name === 'ValidationError' || (err.name === 'CastError' && err.path === '_id')) {
          throw new BadRequestError(`Передан некорректный id ${id} карточки.`);
        /*
        return res.status(ERROR_CODE_400).send({
          message: `Передан некорректный id ${id} карточки.`,
        }); */
        }

        throw new InternalServerError('Произошла ошибка.');

        // return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' });
      });
  }
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
        throw new NotFoundError(`Передан несуществующий id ${id} карточки.`);
        /*
        return res.status(ERROR_CODE_404).send({
          message: `Передан несуществующий id ${id} карточки.`,
        }); */
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || (err.name === 'CastError' && err.path === '_id')) {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка.');
      }
      /* return res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные для постановки лайка.' });
      } */

      throw new InternalServerError('Произошла ошибка.');

      // return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const id = req.params.cardId;

  if (!req.user._id) {
    throw new NotFoundError('Переданы некорректные данные для снятия лайка.');
    /*
    return res.status(ERROR_CODE_404).send({
      message: 'Переданы некорректные данные для снятия лайка.',
    }); */
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
        /*
        return res.status(ERROR_CODE_404).send({
          message: `Передан несуществующий id ${id} карточки.`,
        }); */
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || (err.name === 'CastError' && err.path === '_id')) {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка.');

        /* return res.status(ERROR_CODE_400).send({
          message: 'Переданы некорректные данные для снятия лайка.' });
        */
      }

      throw new InternalServerError('Произошла ошибка.');

      // return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка.' });
    });
};
