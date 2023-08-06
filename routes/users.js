const router = require('express').Router();

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

router.post('/signin', login);
router.post('/signup', createUser);

router.get('/users', auth, getUsersAll);
router.get('/users/:_id', auth, getUserId);
router.get('/users/me', auth, getUsersMe);
router.patch('/users/me', auth, updateUser);
router.patch('/users/me/avatar', auth, updateUserAvatar);

module.exports = router;
