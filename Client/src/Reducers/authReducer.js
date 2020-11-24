import isEmpty from '../validation/is-empty';
import {SET_CURRENT_USER} from "../actions/types"
const initialState ={
    isAdmin: false,
    isAuthenticate: false,
    user: {}
}

export default function(state = initialState , action){
    switch(action.type) {
        case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        isAdmin: action.payload.isAdmin
      };
    default:
      return state;
  }
}