const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateBookInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.author = !isEmpty(data.author) ? data.author : '';
  data.description = !isEmpty(data.description) ? data.description : '';
  data.uploader = !isEmpty(data.uploader) ? data.uploader : '';
  data.poster = !isEmpty(data.poster) ? data.poster : '';

 
  
  if (Validator.isEmpty(data.name)) {
    errors.message = 'Book Name is required';
  }

  if (Validator.isEmpty(data.author)) {
    errors.message = 'Author name is required';
  }

  if (Validator.isEmpty(data.description)) {
    errors.message = 'Description is required';
  }

  
  if (Validator.isEmpty(data.poster)) {
    errors.message = 'Poster Url was not found';
  }

  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
