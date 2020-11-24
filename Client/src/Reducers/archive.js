import {GET_ARCHIVES} from "../actions/types"

const initialState ={
   Books:[],
   Key: [],
   Count: []

}

export default function(state = initialState , action){
    switch(action.type) {
        case GET_ARCHIVES:
      return {
       Books : action.payload.Items,
       Key: action.payload.LastEvaluatedKey,
       Count: action.payload.Count 
      };
    default:
      return state;
  }
}