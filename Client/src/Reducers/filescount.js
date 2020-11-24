import {MONTHLY_FILES_COUNT} from "../actions/types"
const initialState ={
  data: {}

}

export default function(state = initialState , action){
    switch(action.type) {
        case MONTHLY_FILES_COUNT:
      return {
           data : action.payload,
      };
    default:
      return state;
  }
}