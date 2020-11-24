import {MY_BOOKS , CLEAR_MYBOOKS} from "../actions/types"
const initialState ={
   Books:[],
   Key: [],
   Count: []

}

export default function(state = initialState , action){
    switch(action.type) {
        case MY_BOOKS:
      return {
       Books : action.payload.Items,
       Key: action.payload.LastEvaluatedKey,
       Count: action.payload.Count 
      };
      case CLEAR_MYBOOKS:
        return{
          ...state,
          Books: [],
          Key: [],
          Count: []
            };
    default:
      return state;
  }
}