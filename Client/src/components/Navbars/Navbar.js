import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import AdminNavbarLinks from "./AdminNavbarLinks.js";
import RTLNavbarLinks from "./RTLNavbarLinks.js";
import Button from "components/CustomButtons/Button.js";
import {GetSearches} from "../../actions/Books.js"
import { connect } from "react-redux";
import propTypes from "prop-types";
import styles from "assets/jss/material-dashboard-react/components/headerStyle.js";

const useStyles = makeStyles(styles);

const Header = (props) => {
  const classes = useStyles();
  const { history, ...rest } = props;
  function makeBrand() {
    var name;
    props.routes.map(prop => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        name =  prop.name;
      }
      return null;
    });
    return "Hii";
  }
  const { color } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color
  });


  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button color="transparent" href="#" className={classes.title}>
           <em> Welcome   {props.auth.user.Username}</em>
          </Button>
        </div>
        <Hidden smDown implementation="css">
          <AdminNavbarLinks
            history = {history}
           />
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object),
  GetSearches:  propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  searches: state.searches
});

export default connect(mapStateToProps, {GetSearches})(Header)