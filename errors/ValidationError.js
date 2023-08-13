const BadRequestError = require('./BadRequestError');
const ConflictError = require('./ConflictError');

const ValidationError = (err, next) => {
  if (err.name === 'ValidationError') {
    throw next(new BadRequestError('Переданы некорректные данные.'));
  } else
    if (err.name === 'CastError') {
      throw next(new BadRequestError('Передан некорректный id.'));
    } else
      if (err.code === 11000) {
        throw next(new ConflictError('Пользователь с таким уже Email существует.'));
      } else { return next(); }
};

module.exports = ValidationError;
