import { GET_FILE } from "../actions/types";
const initialState ={
    url : ""
}


export default function(state = initialState , action){
    switch(action.type) {
        case GET_FILE:
            return{
                ...state,
                url : action.payload
          };
        
       
        default:
            return state
    }

}