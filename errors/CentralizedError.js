// eslint-disable-next-line no-unused-vars
const CentralizedError = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMessage = err.message;

  res.status(errStatus).send({ errMessage: errStatus === 500 ? 'На сервере произошла ошибка' : errMessage });
};

module.exports = { CentralizedError };
