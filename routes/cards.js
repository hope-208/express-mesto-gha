const router = require('express').Router();

// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');

// const regexUrl = require('../utils/constants');

const {
  getCardsAll,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const auth = require('../middlewares/auth');

router.get('/cards', auth, getCardsAll);
router.post(
  '/cards',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      // eslint-disable-next-line no-useless-escape
      link: Joi.string().required().regex(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/),
    })
  }),

  createCard
);
router.delete(
  '/cards/:cardId',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex()
    })
  }),
  deleteCard
);
router.put(
  '/cards/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex()
    })
  }),
  likeCard
);
router.delete(
  '/cards/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex()
    })
  }),
  dislikeCard
);

module.exports = router;
