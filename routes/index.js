const express = require('express');

const app = express();

const NotFoundError = require('../errors/NotFoundError');

app.use(express.json());

app.use('/', require('./users'));
app.use('/', require('./cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

module.exports = app;
