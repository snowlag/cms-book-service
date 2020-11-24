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
import CardFooter from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem";
import { connect } from "react-redux";
import {ViewSubcategory ,ViewsubBook,clearSubbooks} from "../../actions/Books.js"
import propTypes from "prop-types";
import axios from "axios";
import LinearProgress from '@material-ui/core/LinearProgress';
import CustomLink from "components/CustomLink/customlink.js"
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

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
    textDecoration: "none",
    display: "inline"
  },
  FButton:{
    float: "right",
    marginRight: "0px"
 },
 BButton:{
   float: "left",
 }
};

const useStyles = makeStyles(styles);

const SubBooks = (props)=> {
  const classes = useStyles();
  const [ books , setBooks] = React.useState([]);
  const [ loading , setLoading] = React.useState("True")
  const [sub ,setSub] = React.useState([]);
  
  const  [arr , setArr] = React.useState([]);
  const [index , setIndex] = React.useState(-1);
  const [disabled , setNext ] = React.useState(true)
  const [prevItems , setPrev] = React.useState([])


 

 const loadmore = () =>{
  console.log(arr);
  console.log(index);
  var lastIndexKey = arr[index];
  setPrev(books);
  props.ViewsubBook( props.match.params.subid , lastIndexKey)
  
 }


  useEffect( () => {
  var item ={}
  props.clearSubbooks();
  props.ViewsubBook(props.match.params.subid , item)  
  props.ViewSubcategory(props.match.params.subid)
  } ,[props.auth])
  

useEffect( () => {
 const { Sub } = props.items
 setSub(Sub)
}, [props.items])

 
useEffect( () => {
  // Logic to disable buuton at last page
  if(!props.subbooks.Key){
     //disable the button next
     setNext(true);
   }else{
     setNext(false)
   }
     //Push the next key in array
    setIndex(index+1)
    setArr([ ...arr , props.subbooks.Key])
    prevItems.push.apply(prevItems, props.subbooks.Books);
    setBooks(prevItems);
      setLoading(false);
  }, [props.subbooks])



let BookContent;

    if(loading) {
      BookContent =<GridContainer>
                      <GridItem xs={12} sm={4} md={12}>
                       <LinearProgress color="secondary"/>
                      </GridItem>
                    </GridContainer> 
    } else if(books.length> 0) {
      BookContent = <GridContainer>           
                      {books.map((book) => 
                       <GridItem xs={12} sm={4} md={3}>
                          <CardBook image={book.poster} title={book.book_name} id={book.id} />
                      </GridItem>
                      
                      )}                  
                    </GridContainer>    
     
    }else{
      BookContent = <GridContainer>
                      <GridItem xs={12} sm={4} md={12}>
                       <h3>No Books in these Category</h3>
                      </GridItem>
                    </GridContainer> 
    }
  return (  <div>
            {sub.map((category) => 
            <Card>        
            <CardHeader color="primary">
              <h2 className={classes.cardTitleWhite}>{category.category_name}</h2>
              < CustomLink id = {category.id} />
              <h4 className={classes.cardCategoryWhite}>{category.category_Desc}</h4>
            </CardHeader>
             <CardBody>{BookContent} </CardBody>
             <CardFooter classNmae={classes.area}>
      <Button
        variant="contained"
        color="secondary"
        className={classes.BButton}
        disabled={disabled}
        onClick= {loadmore}
       >Load More</Button>
     </CardFooter> 
           </Card>
            )}
           </div>
  ) 
}

const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  items: state.items ,
  subbooks: state.subbooks
});

export default connect(mapStateToProps , {ViewSubcategory , ViewsubBook , clearSubbooks})(SubBooks);
