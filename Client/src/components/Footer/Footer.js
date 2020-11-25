/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
// core components
import styles from "assets/jss/material-dashboard-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="https://github.com/snowlag" target="_blank" className={classes.block}>
                Github
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://www.linkedin.com/in/ankit-j-013332129/" target="_blank" className={classes.block}>
                Linkedin
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="http://blitzhub.herokuapp.com/" target="_blank" className={classes.block}>
                Blitzhub
              </a>
            </ListItem>
          </List>
        </div>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a
              href="https://www.creative-tim.com?ref=mdr-footer"
              target="_blank"
              className={classes.a}
            >
              Ankit Joshi and Himanshu magar
            </a>
            , made with love for better web
          </span>
        </p>
      </div>
    </footer>
  );
}
