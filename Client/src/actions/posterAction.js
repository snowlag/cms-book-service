import axios from "axios"
import { GET_POSTER , CLEAR_ERRORS, GET_ERRORS , GET_FILE} from "./types";


//Routes related to uploading files in S3


//-------------------------------------------------------------------------------------------------------------------
//Route to upload poster in S3
//Used in forms of uploading poster
//returns the url from s3
//Access = Private Method = POST
export const addPoster = formData => dispatch => {
    
    axios
    .post("/api/uploadImage", formData)
     .then(res =>
        dispatch({
            type: GET_POSTER,
            payload: res.data
          })

     )
     .catch( err => 
      dispatch({
        type: GET_ERRORS,
        payload: err
    })
     
     );
  };
  //----------------------------------------------------------End of the Route------------------------------------------------

  //Route to upload pdf file to s3
  //Returns the location url from s3
  //Access = Private Methof POST
  export const addFile = formData => dispatch => {
    
    axios
    .post("/api/uploadFiles", formData)
     .then(res =>
        dispatch({
            type: GET_FILE,
            payload: res.data.locationArray[0]
          })

     )
     .catch( err => 
      dispatch({
        type: GET_ERRORS,
        payload: err
    })
     
     );
  };


  export const addBookFile = formData => dispatch => {
    
    axios
    .post("/api/uploadFiles/Book", formData)
     .then(res =>
        dispatch({
            type: GET_FILE,
            payload: res.data.locationArray[0]
          })

     )
     .catch( err => 
      dispatch({
        type: GET_ERRORS,
        payload: err
    })
     
     );
  };

  export const addChapterFile = formData => dispatch => {
    
    axios
    .post("/api/uploadFiles/Chapter", formData)
     .then(res =>
        dispatch({
            type: GET_FILE,
            payload: res.data.locationArray[0]
          })

     )
     .catch( err => 
      dispatch({
        type: GET_ERRORS,
        payload: err
    })
     
     );
  };

  export const addSolutionFile = formData => dispatch => {
    
    axios
    .post("/api/uploadFiles/Solution", formData)
     .then(res =>
        dispatch({
            type: GET_FILE,
            payload: res.data.locationArray[0]
          })

     )
     .catch( err => 
      dispatch({
        type: GET_ERRORS,
        payload: err
    })
     
     );
  };

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
