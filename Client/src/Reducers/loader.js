import { SET_LOADER , REMOVE_LOADER , FINISH_LOADER } from "../actions/types";
const initialState ={
    Loading: false
}


export default function(state = initialState , action){
    switch(action.type) {
        case SET_LOADER:
            return{
                ...state,
                Loading: true
          };
          case REMOVE_LOADER:
            return{
                ...state,
                Loading: false
          };
          case FINISH_LOADER:
            return{
                ...state,
                Loading: "complete"
          };
       
        default:
            return state
    }

}