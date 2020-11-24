import axios from "axios"
import  {CLEAR_ERRORS, 
  GET_ERRORS ,
  GET_CATEGORIES ,
  GET_SUBCATEGORIES ,
  GET_USERS ,GET_ACTIVITIES ,
  GET_BOOKS , CATEGORY_LOADING ,
  GET_ALL_BOOKS , GET_MY_BOOKS , 
  GET_CHAPTER ,
  GET_SOLUTION, 
  GET_SUBCATEGORY ,
  GET_CATEGORY,
  GET_SUB,
  CLEAR_ITEMS,
  STATS,
  SUB_BOOKS ,
  SUB_CATEGORIES,
  MY_BOOKS,
  CATEGORIES,
  CLEAR_CATEGORIES,
  CLEAR_MYBOOKS,
  CLEAR_SUBBOOKS,
  CLEAR_SUBCATEGORIES,
  GET_ARCHIVES,
  GET_SEARCHES,
  SET_LOADER,
  REMOVE_LOADER ,
  FINISH_LOADER,
  BOOK_COUNT,
  MONTHLY_FILES_COUNT,
  USER_UPLOADS,
  USER_MONTHLY_BOOK_UPLOADS,
  USER_MONTHLY_FILE_UPLOADS,
  USER_WEEKLY_BOOK_UPLOADS,
  USER_WEEKLY_FILE_UPLOADS
   } from "./types";   

//All the Client requests of the Book CMS -----------------------------------------------------------------------------------


//Route to Post Category
//Method = POST
//Access = Private
//----------------------------------------------------------------------------------
export const PostCategory = (items , history) => dispatch => {
        dispatch(clearErrors());
        axios
        .post("/api/upload/category", items)
         .then(res =>history.push("/admin/Dashboard"))
         .catch( err => {
          if(err.response){
            dispatch({
              type: GET_ERRORS,
              payload: err.response.data
            })
          
          }else{
            dispatch({
              type: GET_ERRORS,
              payload: err
            })
          }
        }
         );
      };

   
//----------------------------------------------------------------------------------

//Route to Post SubCategory
//Method = POST
//Access = Private
//----------------------------------------------------------------------------------
export const PostSubCategory = (items , history) => dispatch => {
    dispatch(clearErrors());
    dispatch(clearItems());
    axios
    .post("/api/upload/subcategory", items)
     .then(res =>history.push("/admin/Dashboard"))
     .catch( err => {
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
     );
  };
//--------------------------------------------------------------------------------------
//Route to add Book
//Method = POST
//Access = Private
export const PostBook = (items , history) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearItems());
  axios
   .post("/api/post/book", items)
         .then(res =>history.push(`/admin/ViewBook/${items.type}/${res.data.Book_id}`))
         .catch( err => {
          if(err.response){
            dispatch({
              type: GET_ERRORS,
              payload: err.response.data
            })
          
          }else{
            dispatch({
              type: GET_ERRORS,
              payload: err
            })
          }
        }
         );
      };
export const GetCategories = (LastEvaluatedKey) => dispatch => {

dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())

if(typeof(LastEvaluatedKey) === "undefined" ){
  LastEvaluatedKey = {}
}
  dispatch(setCategoryLoading());
  dispatch(clearItems());
  axios
   .post("/api/getCategories" , {LastEvaluatedKey})
    .then(res =>
      dispatch({     
        type: CATEGORIES,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
export const GetAllCategories = () => dispatch => { 
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(setCategoryLoading());
  dispatch(clearItems());
  axios
   .get("/api/getAllCategories" )
    .then(res =>
      dispatch({     
        type: GET_CATEGORIES,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}



//-----------------------------------------------------------------------------------------
//Route to get Sub Categories
//Access = Private
//Used in Adding Book Page to select Sub Category
export const GetSubCategories = () => dispatch => {

  dispatch(clearCategories())
 dispatch(clearMybooks())
 dispatch(clearSubbooks())
 dispatch(clearSubcategories())
  dispatch(setCategoryLoading());
  dispatch(clearErrors());
  dispatch(clearItems());
  axios
   .get("/api/get/Sub Category")
    .then(res =>
      dispatch({
        type: GET_SUBCATEGORIES,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}

export const GetAllSubCategories = (id) => dispatch => {
  dispatch(setCategoryLoading()); 
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(clearItems());
  axios
   .get(`/api/getAllSubCategories/${id}`)
    .then(res =>
      dispatch({     
        type: GET_SUBCATEGORIES,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
//---------------------------------------------------------------------------------------------
//Route to get all the Users
// Access = Private
// Currently not Used anywhere
export const GetUsers = () => dispatch => {
  dispatch(clearErrors());
  axios
   .get("/api/get/User")
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
//------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
//Route to get sub Categories according to parent category
//Used to view Category Page
//Access Private
//Method = GET
export const ViewSubcategories = (parent_id , LastEvaluatedKey) => dispatch => {
  
if(typeof(LastEvaluatedKey) === "undefined" ){
  LastEvaluatedKey = {}
}
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
  dispatch(clearErrors());
  axios
   .post(`/api/getSubChild/Key/Sub Category/${parent_id}` , {LastEvaluatedKey})
    .then(res =>
      dispatch({
        type: SUB_CATEGORIES,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
//----------------------------------------------------------------------------------------------------------
//Route to view particular Subcategory 
//Method = GET
// Access Private
export const ViewSubcategory = (id ,type) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(clearErrors());
  axios
   .get(`/api/getItem/Sub Category/${id}`)
    .then(res =>
      dispatch({
        type: GET_SUB,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
//---------------------------------------------------------------------------------------------
//Route to view Books according to parent sub Category
// Access Private
//Used in view Category page and view Subcategory page
export const ViewBooks = (parent_id ,type) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(clearErrors());
  axios
   .get(`/api/getChild/${type}/${parent_id}`)
    .then(res =>
      dispatch({
        type: GET_BOOKS,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
//-------------------------------------------------------------------------------------------------------
//Route to get Books of particular user logged in
//Access = Private
//Used in view my book Page
export const ViewMyBooks = (LastEvaluatedKey) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(clearErrors());
  axios
   .post(`/api/getOwned/key/Book` , {LastEvaluatedKey})
    .then(res =>
      dispatch({
        type: MY_BOOKS,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
export const ViewMyCatBooks = (id , LastEvaluatedKey) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(clearErrors());
  axios
   .post(`/api/getMyBook/cat/${id}` , {LastEvaluatedKey})
    .then(res =>
      dispatch({
        type: MY_BOOKS,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}

export const ViewMySubBooks = (id , LastEvaluatedKey) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(clearErrors());
  axios
  .post(`/api/getMyBook/sub/${id}` , {LastEvaluatedKey})
    .then(res =>
      dispatch({
        type: MY_BOOKS,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}

//-------------------------------------------------------------------------------------------
//Route to View Particular book
//Access Private
//Used in Book View page
export const ViewBookPage = (id , type) => dispatch => {

  dispatch(clearCategories())
 dispatch(clearMybooks())
 dispatch(clearSubbooks())
 dispatch(clearSubcategories())
  dispatch(clearItems());
  dispatch(clearErrors());
  axios
   .get(`/api/getItem/${type}/${id}`)
    .then(res =>
      dispatch({
        type: GET_BOOKS,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}


//-----------------------------------------------------------------------------------
//Route to update book with the link which may be direct or came from s3
//Used to updating book with the file
export const UploadLink = (item , history) => dispatch => {
  if ('url' in item && item.url && item.url.includes('1drv.ms')) {
    item['url'] = item.url.replace('1drv.ms','1drv.ws');
  }
  axios.put("/api/upload/booklink", item)
  .then(res => {
      history.push("/admin/ViewBook/"+item.type+"/" +item.id)
  })
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
  );
   
}
//----------------------------------------------------------------------------------------------------------------
//Route for uploading chapter and solution
//Access = Private
//POST
export const UploadItem = (item , history) => dispatch => {
  if ('url' in item && item.url && item.url.includes('1drv.ms')) {
    item['url'] = item.url.replace('1drv.ms','1drv.ws');
  }
  axios.post("/api/post/item", item)
  .then(res => {
      history.push("/admin/ViewBook/"+item.Btype +"/"+ item.id)
  })
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
   );
}
//------------------------------------------------------------------------------------------------
//Route to edit book description 
// Access = private 
//Method PUT
export const EditBook = (item , history) => dispatch => {
  axios.put("/api/edit/book", item)
  .then(res => {
      history.push("/admin/ViewBook/"+item.type+ "/" +item.id)
  })
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
   );
}
//-------------------------------------------------------------------------------------------------------------------------
//Access = Private
//Route to edit poster of the book
// Private PUT
export const EditPoster = (item , history) => dispatch => {
  axios.put("/api/edit/poster", item)
  .then(res => {
      history.push("/admin/ViewBook/"+ item.type+"/"+  item.id)
  })
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
   );
}
//----------------------------------------------------------------
//Route to get info of chapter
//Used in edit chapter page
// Method GET
export const ViewChapter = (id) => dispatch => {

  dispatch(clearCategories())
 dispatch(clearMybooks())
 dispatch(clearSubbooks())
 dispatch(clearSubcategories())
  dispatch(clearErrors());
  axios
   .get(`/api/getItem/Chapter/${id}`)
    .then(res =>
      dispatch({
        type: GET_CHAPTER,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
//------------------------------------------------------------------------------------------------------
//Access = Private
//Method GET
//Route to get info of solution in edit solution page
export const ViewSolution = (id) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(clearErrors());
  axios
   .get(`/api/getItem/Solution/${id}`)
    .then(res =>
      dispatch({
        type: GET_SOLUTION,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
//------------------------------------------------------------------------------------------------------
//Route to edit Chapter and solution
//Method PUT
// Access Private
export const EditItem = (item , history) => dispatch => {
  if ('url' in item && item.url && item.url.includes('1drv.ms')) {
    item['url'] = item.url.replace('1drv.ms','1drv.ws');
  }
  dispatch(clearErrors());
  axios
   .put("/api/edit/item" , item)
    .then(res => history.push(`/admin/ViewBook/`+item.Btype+"/" + res.data.id))
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
//-------------------------------------------------------------------------------------------
//Route to get info of particular Category
//Used in edit Category page
//Access private GET
export const ViewCategory = (id ,type) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(clearErrors());
  axios
   .get(`/api/getItem/Category/${id}`)
    .then(res =>
      dispatch({
        type: GET_CATEGORY,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
//-----------------------------------------------------------------------------------------------------
//Route to view Sub Category info
//Used in edit Sub Category page
//Access private GET
export const ViewSubCategory = (id ,type) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(clearErrors());
  axios
   .get(`/api/getItem/${type}/${id}`)
    .then(res =>
      dispatch({
        type: GET_SUBCATEGORY,
        payload: res.data
      }) )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      );
}
//----------------------------------------------------------------------------------------------
//Route to edit Category
//Used in edit Category page
//Access private PUT
export const EditCategory = (item , history) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
  dispatch(clearErrors());
  axios
   .put("/api/edit/category" , item)
    .then(res => history.push("/admin/dashboard"))
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
      )
}
//-----------------------------------------------------------------------------------------------------
//Route to edit Sub Category page
//Used in edit Category page
//Access Private  route
export const EditSubCategory = (item , history) => dispatch => {
  dispatch(clearErrors());
  axios
   .put("/api/edit/subcategory" , item)
    .then(res => history.push(`/admin/dashboard/${item.parent}`))
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
  )}
//----------------------------------------------------------------------------------------------------------
//Route to edit Category Poster
// Access Private
//Used in Edit Category Page PUT
  export const EditCategoryPoster = (item , history) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
    axios.put("/api/edit/Categoryposter", item)
    .then(res => {
        history.push("/admin/Dashboard")
    })
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
     );
  }
  //-----------------------------------------------------------------------------------------------------------
//Route to get all Counters
//Used in Dashboard page
//Access Private
  export const Getstats = () => dispatch => {
    
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubbooks())
dispatch(clearSubcategories())
    axios.get("/api/get/dyno/stats")
    .then(res => 
      dispatch({
        type: STATS,
        payload:  res.data
      })
       
    )
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      
      }else{
        dispatch({
          type: GET_ERRORS,
          payload: err
        })
      }
    }
     );
  }
//------------------------------------------------------------------------------------------------------------------------------
//Route to get paginated books
export const ViewsubBook = (id , LastEvaluatedKey) => dispatch => {
  
 dispatch(clearCategories())
dispatch(clearMybooks())
dispatch(clearSubcategories())
  axios
  .post(`/api/getChild/Key/Book/${id}` ,  {LastEvaluatedKey})
  .then(res => 
    dispatch({
      type: SUB_BOOKS,
      payload:  res.data
    })
     
  )
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
   );
}

export const UploadBulk = (item , history) => dispatch => {
 
  axios.post("/api/upload/Bulk/items", item)
  .then(res => history.push(`/admin/ViewBook/${item.Btype}/${item.id}`))
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
   );
}


export const SwitchArchive = (item , history) => dispatch => {
 
  axios.put("/api/archiveSwitch", item)
  .then(res => history.push(`/admin/ViewBook/${res.data.type}/${item.id}`))
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
   );
}


export const GetTableActivities = (LastEvaluatedKey) => dispatch => {
 
  axios.post("/api/tableActivities", {LastEvaluatedKey})
  .then(res =>{
    dispatch({
      type: GET_ACTIVITIES,
      payload:  res.data
    })
  })
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
   );
}


export const GetTableBooks = (LastEvaluatedKey) => dispatch => {
 
  axios.post("/api/tableBooks", {LastEvaluatedKey})
  .then(res =>{
    dispatch({
      type: GET_ALL_BOOKS,
      payload:  res.data
    })
  })
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
   );
}


export const GetArchives = (LastEvaluatedKey) => dispatch => {
 
  axios.post("/api/ArchivedBooks", {LastEvaluatedKey})
  .then(res =>{
    dispatch({
      type: GET_ARCHIVES,
      payload:  res.data
    })
  })
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
   );
}


export const GetSearches = (item) => dispatch => {
  dispatch(setSearchLoading());
  axios.get(`/api/Search/${item.query}/${item.page}/${item.limit}`)
  .then(res =>{
    dispatch({
      type:  GET_SEARCHES,
      payload:  res.data
    })
    dispatch(finishSearchLoading());
  })
  .catch(err =>{
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
    dispatch({
      type:  REMOVE_LOADER,
    })
    dispatch(stopSearchLoading());
  });
}



//Get monthly book count count
export const GetMonthlyBookCount = () => dispatch => {
 
  axios.get("/api/getMonthly/bookCount")
  .then(res =>{
    dispatch({
      type: BOOK_COUNT,
      payload:  res.data
    })
  })
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
   );
}



//Get weekly book count 
export const GetWeeklyBookCount = () => dispatch => {
 
  axios.get("/api/getWeekly/bookcount")
  .then(res =>{
    dispatch({
      type: BOOK_COUNT,
      payload:  res.data
    })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
   );
}

//Get monthly file count
export const GetMonthlyFileCount = () => dispatch => {
 
  axios.get("/api/getMonthly/FileCount")
  .then(res =>{
    dispatch({
      type: MONTHLY_FILES_COUNT,
      payload:  res.data
    })
  })
  .catch(err =>{
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    
    }else{
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    }
  }
   );
}


//Get monthly file count
export const GetWeeklyFileCount = () => dispatch => {
 
  axios.get("/api/getWeekly/FileCount")
  .then(res =>{
    dispatch({
      type: MONTHLY_FILES_COUNT,
      payload:  res.data
    })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
   );
}





//Get User Book Uploads count
export const GetUserUploads = () => dispatch => {
  axios.get("/api/useruploads")
  .then(res =>{
    dispatch({
      type: USER_UPLOADS,
      payload:  res.data
    })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
   );
}
//Get User Book Uploads count
export const GetUserMonthlybookUploads = (item) => dispatch => {
  axios.get(`/api/getUserMonthly/book/${item.monthnum}/${item.year}`)
  .then(res =>{
    dispatch({
      type: USER_MONTHLY_BOOK_UPLOADS,
      payload:  res.data
    })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
   );
}

//Get User Book Uploads count
export const GetUserMonthlyFileUploads = (item) => dispatch => {
  axios.get(`/api/getUserMonthly/file/${item.monthnum}/${item.year}`)
  .then(res =>{
    dispatch({
      type: USER_MONTHLY_FILE_UPLOADS,
      payload:  res.data
    })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
   );
}


//Get User  Uploads Book count
export const GetUserWeeklyBookUploads = (item) => dispatch => {
  axios.get(`/api/getUserWeekly/book/${item.week}/${item.monthnum}/${item.year}`)
  .then(res =>{
    dispatch({
      type: USER_WEEKLY_BOOK_UPLOADS,
      payload:  res.data
    })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
   );
}



//Get weekly User  Uploads files count
export const GetUserWeeklyFileUploads = (item) => dispatch => {
  axios.get(`/api/getUserWeekly/file/${item.week}/${item.monthnum}/${item.year}`)
  .then(res =>{
    dispatch({
      type: USER_WEEKLY_FILE_UPLOADS,
      payload:  res.data
    })
  })
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
   );
}

// Set loading state
export const setCategoryLoading = () => {
  return {
    type: CATEGORY_LOADING
  };
};
// Clear Items
export const clearItems = () => {
  return {
    type: CLEAR_ITEMS
  };

};

   // Clear errors
   export const clearErrors = () => {
    return {
      type: CLEAR_ERRORS
    };
  };
//Pagination state clean up

 export const clearMybooks = () => dispatch => {
  dispatch({
    type: CLEAR_MYBOOKS
  })
 }

 export const clearSubcategories = () => dispatch =>{
  dispatch({
   type: CLEAR_SUBCATEGORIES
  })
 }

 export const clearCategories = () => dispatch =>{
  dispatch({ 
    type: CLEAR_CATEGORIES
  })
 }

 
 export const clearSubbooks  = () => dispatch =>{
  dispatch({ 
    type: CLEAR_SUBBOOKS
  })
 }

 export const setSearchLoading = () =>  dispatch => {
  dispatch({ 
    type: SET_LOADER
  })
 }

 
 export const stopSearchLoading = () =>  dispatch => {
  dispatch({ 
    type: REMOVE_LOADER
  })
 }

 
 
 export const finishSearchLoading = () =>  dispatch => {
  dispatch({ 
    type: FINISH_LOADER
  })
 }
