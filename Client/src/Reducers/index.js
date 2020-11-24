import { combineReducer, combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from './errorReducer'
import posterReducer from './posterReducer'
import itemReducer from './GetItemsReducer'
import filereducer from './FIleReducer'
import statreducer from './statsReducer'
import subbooks from './Subbooks.js'
import subcategories from './Subcategories.js'
import mybooks from './mybooks.js'
import categories from './getCategories'
import archives from './archive'
import searches from './searches'
import loader from './loader'
import activities from './activities'
import books from './getBooks'
import monthlybooks from './monthlybooks'
import useruploads from "./useruploads";
import filescount from "./filescount"

export default combineReducers({
    auth : authReducer,
    errors: errorReducer,
    poster: posterReducer,
    items: itemReducer,
    file: filereducer,
    stats: statreducer,
    subbooks: subbooks,
    subcategories: subcategories,
    mybooks: mybooks,
    categories: categories,
    archives: archives,
    searches: searches,
    loader: loader,
    activities: activities,
    books: books,
    monthlybooks: monthlybooks,
    uploads: useruploads,
    filescount: filescount
})