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
import CardFooter from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem";
import Select from "@material-ui/core/Select";
import { connect } from "react-redux";
import {ViewMyBooks} from "../../actions/Books.js";
import propTypes from "prop-types";
import LinearProgress from '@material-ui/core/LinearProgress';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {GetAllSubCategories ,GetAllCategories , clearMybooks ,  ViewMyCatBooks , ViewMySubBooks} from "../../actions/Books.js"
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CardActions from '@material-ui/core/CardActions';
import { setEmitFlags } from "typescript";
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Paper from '@material-ui/core/Paper';
const styles = {
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
  },
  area:{
    display: "inline"
  },
  FButton:{
     float: "right"
  },
  content: {
    marginTop : "60px"
  },
  BButton:{
    float: "left",
  },
  paper: {
    marginBottom: "50px",
    padding: "20px"
  }

  
};

const useStyles = makeStyles(styles);

const UserDashBoard =(props) =>{
const classes = useStyles();
const [Loading , setLoading] = React.useState(true)
const [Books, setBooks] = React.useState([]);
const  [arr , setArr] = React.useState([]);
const [index , setIndex] = React.useState(-1);
const [disabled , setNext ] = React.useState(true)
const [prevItems , setPrev] = React.useState([])
const [id, setId] = React.useState("");
const [catId, setCatId] = React.useState("");
const [subId, setSubId] = React.useState("");
const [categories, setCategories] = React.useState([]);
const [subcategories, setSubCategories] = React.useState([]);
const [filter , setFilter] = React.useState(null)
const clearStates = ()=> {
  setBooks([]);
  setPrev([])
  setArr([]);
  setIndex(-1)
}

 const handleCatChange = event => {
  var index={}
  setCatId(event.target.value);
  clearStates();
  setFilter("Category")
  props.ViewMyCatBooks(event.target.value , index );
  props.GetAllSubCategories(event.target.value)
};


const handleSubChange = event => {
  var index={}
  setSubId(event.target.value);
  clearStates();
  setFilter("Subcategory")
  props.ViewMySubBooks(event.target.value , index );
};





useEffect( () => {
  setSubCategories(props.items.SubCategories);  
}, [props.items.SubCategories])


useEffect( () => {
  setCategories(props.items.Categories);
  //Route
}, [props.items.Categories])



const loadmore = (event)=>{
    console.log(arr);
    var lastIndexKey = arr[index];
    setPrev(Books);
  //Three Cases
  //All my books
   if(!filter){
    console.log("No filter")
    props.ViewMyBooks(lastIndexKey)

   }else if(filter === "Category"){
    console.log("Category")
    console.log(lastIndexKey);
    props.ViewMyCatBooks(catId , lastIndexKey )

   }else if(filter === "Subcategory"){
    console.log("Sub Category")
    console.log(lastIndexKey);
    props.ViewMySubBooks(catId , lastIndexKey )
   }
   }

const reset = () => {
  clearStates();
  setFilter(null);
  setCatId("")
  var items ={}
  props.GetAllCategories();
  props.ViewMyBooks(items);


}
var items ={}
  useEffect( () => {
    props.GetAllCategories();
    props.ViewMyBooks(items)
  } ,[props.auth])
  

  
useEffect( () => {
  console.log(props.mybooks.Count);
  // Logic to disable buuton at last page
  console.log(props.mybooks.Key);
  console.log("Here")
   if(!props.mybooks.Key || props.mybooks.Count < 12){
     //disable the button next
     setNext(true);
   }else{
     setNext(false)
   }
 
setIndex(index+1)
 setArr([ ...arr , props.mybooks.Key])
 prevItems.push.apply(prevItems, props.mybooks.Books);
 setBooks(prevItems);
   setLoading(false);
 }, [props.mybooks.Key])
 


  let Content;
  if(Loading) {
    Content =<GridContainer classNamae = {classes.content}>
                    <GridItem xs={12} sm={4} md={12}>
                    <h3>Loading...</h3>
                    <LinearProgress color="secondary"/>
                    </GridItem>
                  </GridContainer> 
  } else if(Books.length > 0){
    Content =  <GridContainer  classNamae = {classes.content}>
                      {Books.map((book) => 
                      <GridItem xs={12} sm={4} md={3}>
                      <CardBook image={book.poster} title={book.book_name} id={book.id} />
                    </GridItem>
                      )}
                </GridContainer>
  } else{
    Content = <GridContainer  classNamae = {classes.content}>
                <h3>You have no Books</h3>
              </GridContainer>
  
  }




  return (
    <Card>
      <CardHeader color="primary">
        <h2 className={classes.cardTitleWhite}>Your Books</h2>
        
      </CardHeader>
      <CardBody>
      <Paper   className={classes.paper} elevation={3} >
      <GridContainer>
      <GridItem xs={6} sm={4} md={4}>
      <InputLabel id="demo-simple-select-label">
                        Category
                      </InputLabel>
        <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={catId}
                      onChange={handleCatChange}
                      placeholder="Category"
                    >  
                    {categories.map((category) => 
                      <MenuItem value={category.id}>{category.category_name}</MenuItem>
                    )}

                    </Select>
      </GridItem>
      <GridItem style={{textAlign: "center"}} xs={6} sm={4} md={4}>
                  <InputLabel id="demo-simple-select-label">
                        Sub Category
                      </InputLabel>
                      <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={subId}
                      onChange={handleSubChange}
                      placeholder="Sub Category"
                    >  
                    {subcategories.map((category) => 
                      <MenuItem value={category.id}>{category.category_name}</MenuItem>
                    )}
                    </Select>
        </GridItem>
        <GridItem xs={6} sm={4} md={4}>
            <Button
            variant="contained"
            color="secondary"
            style={{float: "right"}}
            className={classes.BButton}
            onClick= {reset}
            >Reset</Button>
        </GridItem>
      </GridContainer>  
      </Paper>
      {Content}
      </CardBody>  
      <CardFooter classNmae={classes.area}>
      <Button
        variant="contained"
        color="secondary"
        disabled={disabled}
        className={classes.BButton}
        onClick= {loadmore}
       >Load More</Button>
     </CardFooter> 
    </Card>
  );
}
UserDashBoard.propTypes ={
  ViewMyBookss: propTypes.func.isRequired,
  GetAllCategories:  propTypes.func.isRequired,
  GetAllSubCategories:  propTypes.func.isRequired,
  ViewMyCatBooks: propTypes.func.isRequired,
  ViewMySubBooks:  propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  items: state.items ,
  mybooks : state.mybooks
});

export default connect(mapStateToProps, {ViewMyBooks , GetAllCategories, GetAllSubCategories , clearMybooks , ViewMyCatBooks , ViewMySubBooks })(UserDashBoard );