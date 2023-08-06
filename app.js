const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());

app.use(express.json());

/*
const crypto = require('crypto'); // экспортируем crypto

const randomString = crypto
  .randomBytes(16) // сгенерируем случайную последовательность 16 байт (128 бит)
  .toString('hex'); // приведём её к строке

console.log(randomString); // 5cdd183194489560b0e6bfaf8a81541e
*/

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страница не найдена.' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT);
