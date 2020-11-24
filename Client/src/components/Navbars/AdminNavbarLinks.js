import React, { useState, useEffect } from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
//Redux
import { connect } from "react-redux";
import {logoutUser} from "../../actions/authAction"
import propTypes from "prop-types";
import { CircularProgress } from "@material-ui/core";
import { LinearProgress } from '@material-ui/core';
import {GetSearches} from "../../actions/Books.js"
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js"; 
const useStyles = makeStyles(styles);

const AdminNavbarLinks = (props) => {
  const { history, ...rest } = props;
  const [query , setQuery] = React.useState(null);
  const [loader , setLoader] = React.useState(null);

  const handleLogout = () =>{
    props.logoutUser();
  }

  const classes = useStyles();
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

 const onInput = (event) => {
  setQuery(event.target.value)
 }

 const onSearch = () => {
   if(query){
    setLoader(
      <LinearProgress color="secondary" />
    )
     var item = {}
    item.page = 1;
    item.limit = 25;
    item.query = query;
    console.log(item);
    props.GetSearches(item);
   }
 }

 
useEffect( () => {
 if(props.flag.Loading === "complete"){
    history.push("/admin/search")
    setLoader(null) 
    setQuery("")
 }
}, [props.flag.Loading])


useEffect( () => {
if(props.searches.Status !== 200){
  setLoader(
    <small>Error from server</small>
  )
}
 }, [props.searches.Status])

  return (
    <div>
      <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: classes.margin + " " + classes.search
          }}
          name="query"
          value={query}
          onChange = {onInput}
          inputProps={{
            placeholder: "Search Books",
            inputProps: {
              "aria-label": "Search"
            }
          }}
        />
        <Button onClick = {onSearch} color="white" aria-label="edit" justIcon round>
          <Search />
        </Button>
      </div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>{props.auth.user.Username}</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleLogout}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
      {loader}
    </div>
  );
}
AdminNavbarLinks.propTypes ={
  auth: propTypes.object.isRequired,
  logoutUser: propTypes.func.isRequired,
  GetSearches:  propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  searches: state.searches,
  flag: state.loader
});

export default connect(mapStateToProps, {logoutUser , GetSearches})(AdminNavbarLinks);