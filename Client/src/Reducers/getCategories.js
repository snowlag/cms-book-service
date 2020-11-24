import {CATEGORIES , CLEAR_CATEGORIES} from "../actions/types"
const initialState ={
   Categories:[],
   Key: []

}

export default function(state = initialState , action){
    switch(action.type) {
        case CATEGORIES:
      return {
      Categories : action.payload.Items,
      Key: action.payload.LastEvaluatedKey    
      };
      case CLEAR_CATEGORIES:
        return{
          ...state,
          Categories: [],
          Key: []
            };
    default:
      return state;
  }
}