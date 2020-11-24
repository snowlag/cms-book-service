import {BOOK_COUNT} from "../actions/types"
const initialState ={
  data: {}

}

export default function(state = initialState , action){
    switch(action.type) {
        case BOOK_COUNT:
      return {
           data : action.payload,
      };
    default:
      return state;
  }
}