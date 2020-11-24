import { GET_CATEGORIES , 
  GET_ACTIVITIES , 
  GET_SUBCATEGORIES ,
  GET_USERS , GET_BOOKS , 
  CATEGORY_LOADING , 
  GET_ALL_BOOKS , 
  GET_MY_BOOKS ,
  GET_CHAPTER ,
  GET_SOLUTION ,
GET_CATEGORY,
GET_SUBCATEGORY,
GET_SUB,
CLEAR_ITEMS
 } from "../actions/types";



const initialState ={
    Categories: [],
    SubCategories: [],
    Users: [],
    Books: [],
    Category_loading: [],
    Mybooks:[],
    Chapter: [],
    Solution: [],
    Category: [],
    Subcategory: [],
    Sub: []
}


export default function(state = initialState , action){
    switch(action.type) {
        case CATEGORY_LOADING:
      return {
        ...state,
        loading: true
      };
        case GET_CATEGORIES:
            return{
                ...state,
               Categories : action.payload
          };
          case GET_SUBCATEGORIES:
            return{
                ...state,
               SubCategories : action.payload
          };
          case GET_USERS:
            return{
                ...state,
               Users : action.payload
          };
          case GET_BOOKS:
            return{
                ...state,
               Books : action.payload
          };
          case GET_MY_BOOKS:
            return{
                ...state,
               Mybooks : action.payload
          };
          case GET_SOLUTION:
            return{
                ...state,
               Solution : action.payload
          };
          case GET_CHAPTER:
            return{
                ...state,
               Chapter : action.payload
          };
          case GET_CATEGORY:
            return{
                ...state,
               Category : action.payload
          };
          case GET_SUBCATEGORY:
            return{
                ...state,
               Subcategory : action.payload
          };
          case GET_SUB:
            return{
                ...state,
               Sub : action.payload
          };
         case CLEAR_ITEMS:
          return{
            ...state,
            SubCategories: [],
            Users: [],
            Activity: [],
            Books: [],
            Totalbooks: [],
            Mybooks:[],
            Chapter: [],
            Solution: [],
            Category: [],
            Subcategory: [],
            Sub: []
              };
       
        default:
            return state
    }

}