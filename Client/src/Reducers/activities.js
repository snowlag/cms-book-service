import {GET_ACTIVITIES} from "../actions/types"

const initialState ={
   Activities:[],
   Key: [],
   Count: []

}

export default function(state = initialState , action){
    switch(action.type) {
        case GET_ACTIVITIES:
      return {
      Activities : action.payload.Items,
       Key: action.payload.LastEvaluatedKey,
       Count: action.payload.Count 
      };
    default:
      return state;
  }
}