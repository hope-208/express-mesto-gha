const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { REGEX_URL } = require('../utils/constants');

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
      link: Joi.string().required().regex(REGEX_URL),
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
