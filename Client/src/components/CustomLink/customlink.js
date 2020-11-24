import React from 'react'
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import propTypes from "prop-types";
const styles = {
    IconButton:{
      float: "right",
      display: "inline",
      marginTop: "10px",
      marginRight: "10px",
      color: "white"
    }
  };
  const useStyles = makeStyles(styles);
export default function CustomLink(props){
    const classes = useStyles();
    const { id } = props;
    const link ="/admin/edit/SubCategory/"+ id;
    return (
        <NavLink style={{ textDecoration: 'none' }} to ={link}>
            <EditIcon  className ={classes.IconButton} />
        </NavLink>
    )
}
CustomLink.propTypes ={
    id: propTypes.string
   };