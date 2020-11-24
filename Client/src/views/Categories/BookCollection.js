import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
// @material-ui/core
import Icon from "@material-ui/core/Icon";
import CardBook from "components/Card/CardBook.js";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem";
import { connect } from "react-redux";
import {ViewBooks} from "../../actions/Books.js"
import propTypes from "prop-types";
import axios from "axios";
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  loading: {
    width: '100%',
    '& > * + *': {
      
    },},
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative"
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px"
  },
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
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

const BookCollection = (props)=> {
  const classes = useStyles();
  const { id, type ,  ...rest } = props;
  const [ books , setBooks] = React.useState([]);
  const [ loading , setLoading] = React.useState("True")
  var LastEvaluatedKey ={}
  useEffect( () => {
    axios
    .get(`/api/getChild/Keylimit/Book/${id}`)
     .then(res =>{
      setBooks(res.data);
      setLoading(false);
      } )
     .catch(err =>{
        console.log(err);
     });   
  } ,[props.items])

  
// useEffect( () => {
 
// }, [props.items])
let BookContent;

    if(loading) {
      BookContent =<GridContainer>
                      <GridItem xs={12} sm={4} md={12}>
                       <LinearProgress color="secondary"/>
                      </GridItem>
                    </GridContainer> ;
    } else if(books && books.length> 0) {
      BookContent = <GridContainer>
                      {books.slice(0, 4).map((book) => 
                       <GridItem xs={12} sm={4} md={3}>
                          <CardBook image={book.poster} title={book.book_name} id={book.id} />;
                      </GridItem>
                      )}
                    </GridContainer>    
     
    }else{
      BookContent = <GridContainer>
                      <GridItem xs={12} sm={4} md={12}>
                       <h3>No Books in these Category</h3>
                      </GridItem>
                    </GridContainer> ;
    }

  return (
           <CardBody>
             {BookContent}
           </CardBody>
       )}

BookCollection.propTypes ={
 ViewSubcategories: propTypes.func.isRequired,
 id: propTypes.string,
 type:propTypes.string
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  items: state.items
});

export default connect(mapStateToProps, {ViewBooks})(BookCollection);
