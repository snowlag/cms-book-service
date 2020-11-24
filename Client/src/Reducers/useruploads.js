import {USER_UPLOADS , USER_MONTHLY_BOOK_UPLOADS , USER_WEEKLY_BOOK_UPLOADS , USER_MONTHLY_FILE_UPLOADS ,  USER_WEEKLY_FILE_UPLOADS} from "../actions/types"
const initialState ={
  data: {},
  monthlybookcounts: {},
  weeklybookcounts: {},
  monthlyfilecounts: {},
  weeklyfilecounts: {}
}

export default function(state = initialState , action){
    switch(action.type) {
      case USER_UPLOADS:
      return {
          ...state,
           data : action.payload,
      };
      case USER_MONTHLY_FILE_UPLOADS:
        return {
          ...state,
             monthlyfilecounts : action.payload,
        };
      case USER_MONTHLY_BOOK_UPLOADS:
        return {
          ...state,
             monthlybookcounts : action.payload,
        };
        case USER_WEEKLY_BOOK_UPLOADS:
        return {
          ...state,
             weeklybookcounts : action.payload,
        };
       
        case USER_WEEKLY_FILE_UPLOADS:
        return {
          ...state,
             weeklyfilecounts : action.payload,
        };
    default:
      return state;
  }
}