import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import Dashboardroutes from "Routes/UserDashboardroutes.js";
import routes from "Routes/routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

import { connect } from "react-redux";
import {logoutUser } from "../actions/authAction"
import propTypes from "prop-types";
let ps;

const switchRoutes = (
  <Switch>
    {Dashboardroutes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            exact path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            exact path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}

  </Switch>
);

const useStyles = makeStyles(styles);

const Admin = (props) => {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  useEffect( () => {
    const { isAuthenticated, user } = props.auth;
    if(!isAuthenticated){
      props.history.push("/")
    }
}, [props.auth])




  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={Dashboardroutes}
        logoText={"Book CMS"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={AdminDashboardroutes}
          handleDrawerToggle={handleDrawerToggle}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            {switchRoutes}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
Admin.propTypes ={
  registerUser: propTypes.func.isRequired,
  auth: propTypes.object.isRequired,
  loginUser: propTypes.func.isRequired ,
  logoutUser: propTypes.func.isRequired

};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {logoutUser})(Admin);