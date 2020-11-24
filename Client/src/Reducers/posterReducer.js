import { GET_POSTER } from "../actions/types";
const initialState ={
    url : ""
}


export default function(state = initialState , action){
    switch(action.type) {
        case GET_POSTER:
            return{
                ...state,
                url : action.payload
          };
        
       
        default:
            return state
    }

}