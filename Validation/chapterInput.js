const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCategoryInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.index = !isEmpty(data.index) ? data.index : '';
  data.url = !isEmpty(data.url) ? data.url : '';
  

 
  
  if (Validator.isEmpty(data.name)) {
    errors.message = 'Name feild is required';
  }

  if (Validator.isEmpty(data.url)) {
    errors.message = 'url is not found';
  }

  if (Validator.isEmpty(data.index)) {
    errors.message = 'Index is required';
  }
 return {
    errors,
    isValid: isEmpty(errors)
  };
};
