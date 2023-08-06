const ERROR_CODE_400 = 400;
const ERROR_CODE_401 = 401;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;
// eslint-disable-next-line
const regexUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

module.exports = {
  ERROR_CODE_400, ERROR_CODE_401, ERROR_CODE_404, ERROR_CODE_500, regexUrl
};
