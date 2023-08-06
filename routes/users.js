const router = require('express').Router();

// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');

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
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/),
  })
}), createUser);

router.get('/users', auth, getUsersAll);
router.get('/users/me', auth, getUsersMe);
router.get(
  '/users/:_id',
  auth,
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex()
    })
  }),
  getUserId
);
router.patch(
  '/users/me',
  auth,
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex()
    }),
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30)
    })
  }),
  updateUser
);
router.patch(
  '/users/me/avatar',
  auth,
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex()
    }),
    body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().regex(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/),
    })
  }),
  updateUserAvatar
);

module.exports = router;
