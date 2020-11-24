import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Edit from "@material-ui/icons/Edit";
import Download from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import Axios from "axios";
import { connect } from "react-redux";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: theme.spacing(4, 0, 2)
  }
}));
const  Listitems = (props) =>  {
  const classes = useStyles();
  const { label, DownloadLink,id ,type,index ,deleteBook ,Btype ,bookid , history,  ...rest } = props;
  const EditLink = "/admin/Viewbook/"+Btype+ "/" + id + "/edit/"+ label + "/" + type;
  const  [deleted , isDeleted] = React.useState(false);
   var bookIndex = 1;

  if(index){
    bookIndex = index
  }


  const deleteItem = () =>{
    if(type == "Book" || type == "A_Book"){
      deleteBook();
    }else{
     Axios
      .delete(`/api/delete/${type}/${id}/${label}/${Btype}/${bookid}`) 
       .then((res) => {
        isDeleted(true);
        //history.go()
       })
       .catch((err) =>{
         console.log(err);
       })
    }
   

  }

  
  let DownloadCompnonent;
  if(DownloadLink){
    DownloadCompnonent = <ListItem>
                          <ListItemText primary={bookIndex + ".  "+ label} />
                          <ListItemAvatar>
                            <NavLink style={{ textDecoration: "none" }} to={EditLink}>
                              <Edit />
                            </NavLink>
                          </ListItemAvatar>
                          <ListItemAvatar>
                          <a href={DownloadLink} target="_blank"><Download /></a>
                          </ListItemAvatar>
                          <ListItemAvatar>
                            <DeleteIcon onClick={deleteItem} />
                          </ListItemAvatar>
                        </ListItem>
  }else{
    DownloadCompnonent = <ListItem><h4>File not uploaded </h4></ListItem>
  }
  if(deleted){
    DownloadCompnonent = null
  }

   return(
    <div>
      {DownloadCompnonent}
    </div>
  );
}
Listitems.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  DownloadLink: PropTypes.string,
  id: PropTypes.string,
  deleteBook : PropTypes.string
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps,  {})(Listitems);