const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { REGEX_URL } = require('../utils/constants');

const {
  login,
  createUser,
  getUsersAll,
  getUserId,
  getUsersMe,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
    })
  }),
  login
);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEX_URL),
  })
}), createUser);

router.get('/users', auth, getUsersAll);
router.get('/users/me', auth, getUsersMe);
router.get(
  '/users/:_id',
  auth,
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().length(24).hex()
    })
  }),
  getUserId
);
router.patch(
  '/users/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30)
    })
  }),
  updateUser
);
router.patch(
  '/users/me/avatar',
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().regex(REGEX_URL),
    })
  }),
  updateUserAvatar
);

module.exports = router;
