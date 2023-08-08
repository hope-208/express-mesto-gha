const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;

const app = require('./routes/index');

app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(errors());

const { CentralizedError } = require('./errors/CentralizedError');

// eslint-disable-next-line no-undef
app.use(CentralizedError(err, req, res, next));

app.listen(PORT);
