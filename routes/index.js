const express = require('express');

const app = express();

const CentralizedError = require('../errors/CentralizedError');

const NotFoundError = require('../errors/NotFoundError');

app.use(express.json());

app.use('/', require('./users'));
app.use('/', require('./cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

app.use((err, req, res, next) => {
  CentralizedError(err, req, res, next);
});

module.exports = app;
