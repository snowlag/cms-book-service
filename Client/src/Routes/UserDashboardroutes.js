
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BookIcon from "@material-ui/icons/Book";
import Notifications from "@material-ui/icons/Notifications";
import CategoryIcon from "@material-ui/icons/Category";
import LocalLibrarySharpIcon from "@material-ui/icons/LocalLibrarySharp";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserDashboard from "views/UserDashboard/UserDashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import AddCategory from "views/AddCategory/addCategory.js";
import AddBook from "views/AddBook/Step1.js";
import TableList from "views/TableList/TableList.js"
import ArchiveList from "views/Archive/archive"
import UserActivity from "views/UserActivity/UserActivity.js";

const UserdashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/UserDashboard",
    name: "My Books",
    icon: LocalLibrarySharpIcon,
    component: UserDashboard,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Book List",
    icon: "content_paste",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/Archivetable",
    name: "Archive Book List",
    icon: "content_paste",
    component: ArchiveList,
    layout: "/admin"
  },
  {
    path: "/add-category",
    name: "Add Category",
    icon: CategoryIcon,
    component: AddCategory,
    layout: "/admin"
  },
  {
    path: "/Add-Book",
    name: "Add Book",
    icon: BookIcon,
    component: AddBook,
    layout: "/admin"
  },
];

export default UserdashboardRoutes;
