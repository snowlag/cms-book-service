import {GET_SEARCHES} from "../actions/types"

const initialState ={
   Books:[],
   Count: -1,
   Time: 0,
   Status: 200,
   Query: ""

}

export default function(state = initialState , action){
    switch(action.type) {
        case GET_SEARCHES:
      return {
       Books : action.payload.body.data,
       Count: action.payload.body.total.value ,
       Time: action.payload.header.duration,
       Status: action.payload.statusCode,
       Query: action.payload.body.query
      }
    default:
      return state;
  }
}