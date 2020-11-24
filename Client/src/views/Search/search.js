import React, { useState, useEffect } from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import propTypes from "prop-types";
import CardBook from "components/Card/CardBook.js";

import { connect } from "react-redux";
import {GetSearches} from "../../actions/Books.js"

import { useForm, ErrorMessage, Controller } from "react-hook-form";
const styles = {
   
    cardCategoryWhite: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none",
      display: "inline"
    }
  };


const  Search = (props) =>{

const useStyles = makeStyles(styles);
const classes = useStyles();
const { handleSubmit, errors, control } = useForm();
const [loader , setLoader]= React.useState(null);
const [Books , setBooks] = React.useState([]);
const [time , setTime] = React.useState(0);
const [status , setStatus] = React.useState(200);
const [count , setCount] = React.useState(-1);
const [query , setQuery] = React.useState("")
const [page , setPage] = React.useState(1)
useEffect( () => {
     setBooks(props.searches.Books);
     setCount(props.searches.Count);
     setStatus(props.searches.Status);
     setQuery(props.searches.Query);
     setTime(props.searches.Time)
}, [props.searches.Books])

let message;
if(count> 0){
message= <h3>{count} Results matched your query in {time} sec</h3>
}else if(count === -1){
    message = <h3>Search Books</h3>
}
else{
    message = <h1>Sorry , No Books were found</h1>
}


  return (
    <>
    <h1>{query}</h1>
    {message}
    <GridContainer>           
               
    {Books.map((book) => 
       <GridItem xs={12} sm={4} md={3}>
          <CardBook image={book.poster} title={book.title} id={book.id} />
      </GridItem>
     )}                         
    </GridContainer>   
    </>
  );
}
Search.propTypes ={
    GetSearches:  propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  searches: state.searches
});

export default connect(mapStateToProps, {GetSearches})(Search);