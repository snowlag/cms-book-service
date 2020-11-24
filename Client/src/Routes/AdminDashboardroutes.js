
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BookIcon from "@material-ui/icons/Book";
import Notifications from "@material-ui/icons/Notifications";
import CategoryIcon from "@material-ui/icons/Category";
import LocalLibrarySharpIcon from "@material-ui/icons/LocalLibrarySharp";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import UserDashboard from "views/UserDashboard/UserDashboard.js";
import AddCategory from "views/AddCategory/addCategory.js";
import AddBook from "views/AddBook/Step1.js";
import TableList from "views/TableList/TableList.js"
import UserActivity from "views/UserActivity/UserActivity.js";
import ArchiveList from "views/Archive/archive"
import Analytics from "views/Analytics/analytics"
import AssessmentIcon from '@material-ui/icons/Assessment';
const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/Analytics",
    name: "Analytics",
    icon: AssessmentIcon,
    component: Analytics,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "Manage User",
    icon: Person,
    component: UserProfile,
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
    path: "/UserActivity",
    name: "User Activity",
    icon: Notifications,
    component: UserActivity,
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

export default dashboardRoutes;
