import CategoryDashboard from "views/Categories/Categories.js";
import ViewBookPage from "views/Book/Book.js";
import UploadBook from "views/AddBook/UploadBook.js";
import UploadChapter from "views/AddBook/UploadChapter.js";
import UploadSolution from "views/AddBook/UploadSolution.js";
import BulkChapterUpload from "views/AddBook/BulkChapterUpload.js"
import BulkSolutionUpload from "views/AddBook/BulkSolutionUpload.js"
import EditBook from "views/Edit/BookEdit.js";
import EditBookFile from "views/Edit/BookFileEdit.js";
import EditChapter from "views/Edit/ChapterEdit.js";
import EditSolution from "views/Edit/SolutionEdit.js";
import EditCategory from "views/Edit/CategoryEdit.js";
import EditPoster from "views/Edit/CategoryImageEdit.js";
import EditBookImage from "views/Edit/BookImageEdit.js";
import SubCategoryPoster from "views/Edit/SubCategoryPoster.js";
import SubBooks from "views/Categories/SubBooks.js"
import test from "views/test.js"
import SubCategoryedit from "views/Edit/SubCategoryedit";
import Search from "views/Search/search"

const Routes = [
  {
    path: "/dashboard/:cat_id",
    component: CategoryDashboard,
    layout: "/admin"
  },
  {
    path: "/Search",
    component: Search,
    layout: "/admin"
  },
  {
    path: "/dashboard/:cat_id/edit",
    component: EditCategory,
    layout: "/admin"
  },
  {
    path: "/edit/SubCategory/:subid",
    component: SubCategoryedit,
    layout: "/admin"
  },
  {
    path: "/dashboard/:cat_id/:subid",
    component: SubBooks,
    layout: "/admin"
  },
  {
    path: "/edit/SubCategory/:subid/:name/poster",
    component: SubCategoryPoster,
    layout: "/admin"
  },
  {
    path: "/edit/:cat_id/:name/poster",
    component: EditPoster,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id",
    component: ViewBookPage,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id/uploadBook/:name",
    component: UploadBook,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id/Bulkchapters/:name",
    component: BulkChapterUpload,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id/Bulksolutions/:name",
    component:BulkSolutionUpload,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id/uploadChapter/:index",
    component: UploadChapter,
    layout: "/admin"
  },
  {
    path: "/test",
    component: test,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id/uploadSolution/:index",
    component: UploadSolution,
    layout: "/admin"
  },
  
  {
    path: "/ViewBook/:type/:id/edit",
    component: EditBook,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id/edit/:name/Book",
    component: EditBookFile,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id/edit/:name/A_Book",
    component: EditBookFile,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id/edit/:name/poster",
    component: EditBookImage,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id/edit/:name/Chapter",
    component: EditChapter,
    layout: "/admin"
  },
  {
    path: "/ViewBook/:type/:id/edit/:name/Solution",
    component: EditSolution,
    layout: "/admin"
  }

];

export default Routes;
