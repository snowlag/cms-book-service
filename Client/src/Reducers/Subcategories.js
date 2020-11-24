import {SUB_CATEGORIES ,CLEAR_ITEMS , CLEAR_SUBCATEGORIES} from "../actions/types"
const initialState ={
   Subcategories:[],
   Key: []

}

export default function(state = initialState , action){
    switch(action.type) {
        case SUB_CATEGORIES:
      return {
       Subcategories : action.payload.Items,
       Key: action.payload.LastEvaluatedKey    
      };
      case CLEAR_SUBCATEGORIES:
        return{
          ...state,
          Subcategories: [],
          Key: []
            };
    default:
      return state;
  }
}