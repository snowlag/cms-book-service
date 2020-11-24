import {SUB_BOOKS , CLEAR_ITEMS , CLEAR_SUBBOOKS} from "../actions/types"
const initialState ={
   Books:[],
   Key: []

}

export default function(state = initialState , action){
    switch(action.type) {
        case SUB_BOOKS:
      return {
       Books : action.payload.Items,
       Key: action.payload.LastEvaluatedKey    
      };
      case CLEAR_SUBBOOKS:
        return{
          ...state,
          Books: [],
          Key: []
            };
    default:
      return state;
  }
}