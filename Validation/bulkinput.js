const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function ValidateBulkInput(data) {
let errors = {};
if(data){
  
data.map((chapter) => {
    if (Validator.isEmpty(chapter.chapter_name)) {
        errors.message = 'All feilds are required';
      }
    
      if (Validator.isEmpty(chapter.url)) {
        errors.message = 'All feilds are required';
      }
})
}else{
  errors.message="Please select files first."
}
 return {
    errors,
    isValid: isEmpty(errors)
  };
};
