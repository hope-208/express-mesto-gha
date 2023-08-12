const BadRequestError = require('./BadRequestError');
const ConflictError = require('./ConflictError');

const ValidationError = (err, next) => {
  if (err.name === 'ValidationError') {
    next(new BadRequestError('Переданы некорректные данные.'));
  }
  if (err.name === 'CastError') {
    next(new BadRequestError('Передан некорректный id.'));
  }
  if (err.code === 11000) {
    return next(new ConflictError('Пользователь с таким уже Email существует.'));
  }
  return next();
};

module.exports = ValidationError;
