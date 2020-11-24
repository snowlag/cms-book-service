import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
// @material-ui/core
import BookCollection from "./BookCollection"

// core components
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from '@material-ui/core/Button';
import CardBody from "components/Card/CardBody.js";
import GridItem from "components/Grid/GridItem";
import { connect } from "react-redux";
import {ViewSubcategories} from "../../actions/Books.js"
import propTypes from "prop-types";
import LinearProgress from '@material-ui/core/LinearProgress';
import EditIcon from '@material-ui/icons/Edit';
import { NavLink } from "react-router-dom";
import CustomLink from "components/CustomLink/customlink.js"
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const styles = {
  loading: {
    width: '100%',
    '& > * + *': {
     
    },
  },
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
  IconButton:{
    float: "right",
    display: "inline",
    marginTop: "10px",
    marginRight: "10px"
    
  },
  backarrow: {
    marginLeft: '50%'
  }
};

const useStyles = makeStyles(styles);
const CategoryDashBoard = (props)=> {
  const classes = useStyles();
  const [ loading , setLoading] = React.useState(true)
  const [subcategories, setSubCategories] = React.useState([]);

  const  [arr , setArr] = React.useState([]);
  const [index , setIndex] = React.useState(-1);
  const [disabled , setNext ] = React.useState(true)
  const [prevItems , setPrev] = React.useState([])
  var item ={}


 var item = {};
  useEffect( () => {
    props.ViewSubcategories(props.match.params.cat_id ,item )
  } ,[props.auth])

  const loadmore = (event)=>{
    console.log(arr);
    console.log(index);
    var lastIndexKey = arr[index];
    setPrev(subcategories);
    props.ViewSubcategories(props.match.params.cat_id , lastIndexKey  )
  }

  
useEffect( () => {
 // Logic to disable buuton at last page
  if(!props.subcategories.Key){
    //disable the button next
    setNext(true);
  }else{
    setNext(false)
  }

  //Push the next key in array
setIndex(index+1)
setArr([ ...arr , props.subcategories.Key])
prevItems.push.apply(prevItems, props.subcategories.Subcategories);
setSubCategories(prevItems);
  setLoading(false);
}, [props.subcategories])



let Content;
if(loading) {
  Content =<GridContainer>
                  <GridItem xs={12} sm={4} md={12}>
                  <LinearProgress color="secondary" />
                  </GridItem>
                </GridContainer> 


} else if(subcategories && subcategories.length >0){
  Content = <GridContainer>
  {subcategories.map((category) => 
      <Card>
      <CardHeader color="primary">
       <NavLink to ={"/admin/dashboard/"+ props.match.params.cat_id +"/"+ category.id} >
        <h2 className={classes.cardTitleWhite}>{category.category_name}</h2>
        </NavLink>
        < CustomLink id = {category.id} />
      <h4 className={classes.cardCategoryWhite}>{category.category_Desc}</h4>
      </CardHeader>
       <BookCollection id={category.id} type= "Book"/>
    </Card>
   )}           <Card>
                 <CardFooter>
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled = {disabled}
                      className={classes.button}
                      onClick = {loadmore}
                     >LOAD MORE</Button>
                    </CardFooter>
                    </Card>
            </GridContainer>

} else{
  Content = <GridContainer>
              <h3>No Books and Subcategories in the Category</h3>
            </GridContainer>
}



  return (
    <div>
      {Content}
    </div>
    
  );
}

CategoryDashBoard.propTypes ={
 ViewSubcategories: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  items: state.items,
  subcategories: state.subcategories
});

export default connect(mapStateToProps, {ViewSubcategories})(CategoryDashBoard);
