import axios from "axios"
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {clearCategories} from "./Books.js"
import { SET_CURRENT_USER, GET_ERRORS ,CLEAR_ERRORS } from "./types";


//Routes related to Authentication

//-----------------------------------------------------------------------------------------------------------------
//Route to register user
//Access = Admin
//POST Method
export const registerUser= (userdata , history) => dispatch=> {
  dispatch(clearErrors());
    axios
     .post("/auth/register", userdata)
     .then(res =>
         history.push('/admin/Dashboard')
        )
     .catch( err => 
         dispatch({
             type: GET_ERRORS,
             payload: err.response.data
         })
        );
}
//-----------------------------------------------------------------------------------------------------------------
//Route to login User
//Access = Public
//Get Access token from server and set to header 
export const loginUser = (userdata , history) => dispatch => {
  dispatch(clearCategories())
  dispatch(clearErrors());
axios.post("/auth/login" , userdata)
    .then(res => {
        // Save to localStorage
        const { token } = res.data;
        // Set token to ls
        localStorage.setItem('jwtToken', token);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));
        //Go to Dashboard
        history.push("/admin/Dashboard");
      })
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
        );
    };
//----------------------------------------------------------------------------------------------------------------------
//Route to set user logged info to state    
// Set logged in user
export const setCurrentUser = decoded => {
    return {
      type: SET_CURRENT_USER,
      payload: decoded
    };
  };
//---------------------------------------------------------------------------------------------
// Log user out
//Route to delete user token 
//redirect to landing page  
export const logoutUser = () => dispatch => {
   dispatch(clearErrors());
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
  
  };
export const changePassword = (userdata ,history) => dispatch=>{
  axios
     .put("/auth/changePassword", userdata)
     .then(res =>
         history.push('/admin/Dashboard')
        
        )
     .catch( err => {
       if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
        );

} 

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};