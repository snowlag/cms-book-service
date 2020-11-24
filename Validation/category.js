const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCategoryInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.desc = !isEmpty(data.desc) ? data.desc : '';
  data.location = !isEmpty(data.location) ? data.location : '';
  

 
  
  if (Validator.isEmpty(data.name)) {
    errors.message = '';
  }

  if (Validator.isEmpty(data.desc)) {
    errors.message = '';
  }

  if (Validator.isEmpty(data.location)) {
    errors.message = '';
  }
 return {
    errors,
    isValid: isEmpty(errors)
  };
};
