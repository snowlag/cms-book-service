const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
 
  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.message = 'Username must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.username)) {
    errors.message = 'Username field is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.message = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.message = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.message = 'Password field is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.message = 'Password must be at least 6 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
