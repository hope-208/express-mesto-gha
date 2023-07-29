const router = require('express').Router();
const {
  getUsersAll,
  getUserId,
  createUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsersAll);
router.get('/users/:_id', getUserId);
router.post('/users', createUser);
router.patch('/users/:_id', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
