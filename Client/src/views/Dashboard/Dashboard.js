import React, { useState, useEffect } from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import CategoryCard from "components/Card/CategoryCard.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import propTypes from "prop-types";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { NavLink } from "react-router-dom";
//Icons
import LibraryBooksSharpIcon from "@material-ui/icons/LibraryBooksSharp";
import CategorySharpIcon from "@material-ui/icons/CategorySharp";
import GroupSharpIcon from "@material-ui/icons/GroupSharp";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
//Style
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { connect } from "react-redux";
import {GetCategories ,Getstats , clearCategories} from "../../actions/Books.js"
import LinearProgress from '@material-ui/core/LinearProgress';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Button from '@material-ui/core/Button';
const  Dashboard = (props) =>{
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [Loading , setLoading] = React.useState(true)
  const [categories, setCategories] = React.useState([]);
  const [usercount , setUsercount] = React.useState(0);
  const [categorycount , setCategorycount] = React.useState(0);
  const [bookcount , setBookcount] = React.useState(0);
  const [time , setTime] = React.useState(0);
  const [files , setFileCount] = React.useState(0)

  const  [arr , setArr] = React.useState([]);
  const [index , setIndex] = React.useState(-1);
  const [disabled , setNext ] = React.useState(true)
  const [prevItems , setPrev] = React.useState([])



  const loadmore = () =>{
    console.log(arr);
    console.log(index);
    var lastIndexKey = arr[index];
    setPrev(categories);
    props.GetCategories( lastIndexKey)
    
   }

   
  useEffect( () => {
    var items ={};
    props.clearCategories();
    props.GetCategories(items);
    props.Getstats();
  } ,[props.auth])
  
useEffect( () => {
  const { stats} = props.stats;
  console.log(stats)
  stats.map((key => {
  setTime(key.Date)
  setUsercount(key.UserCount);
  setCategorycount(key.CategoryCount);
  setBookcount(key.BookCount);
  setFileCount(key.filesCount)
  }))
  
}, [props.stats])




  
useEffect( () => {
  // Logic to disable buuton at last page
   if(!props.categories.Key){
     //disable the button next
     setNext(true);
   }else{
     setNext(false)
   }
 
   //Push the next key in array
 setIndex(index+1)
 setArr([ ...arr , props.categories.Key])
 prevItems.push.apply(prevItems, props.categories.Categories);
 setCategories(prevItems);
   setLoading(false);
 }, [props.categories])




useEffect( () => {
  setLoading(props.items.loading)
  console.log(Loading)
}, [props.items.loading])

let Content;

    if(Loading) {
      Content =<GridContainer>
                      <GridItem xs={12} sm={4} md={12}>
                       <LinearProgress color="secondary"/>
                      </GridItem>
                    </GridContainer> 
    } else if(categories && categories.length> 0){
      Content =  <GridContainer>
                 {categories.map((category) => 
                     <GridItem xs={12} sm={6} md={3}>
                     <CategoryCard
                       image={category.poster}
                       title={category.category_name}
                       description={category.category_Desc.slice(0, 20) + "..."}
                       category_id = {category.id}
                       ViewLink='/admin/Dashboard/'
                       EditLink="/admin/Dashboard/"
                     />
                   </GridItem>     
                    )}
                  <Card>
                    <CardFooter>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      disabled={disabled}
                      onClick= {loadmore}
                     >Load more</Button>
                    </CardFooter>
                  </Card>
                   
                  </GridContainer>
    }else{
      Content = <GridContainer>
                    <GridItem xs={12} sm={4} md={12}>
                     <h1>Welcome to Book Cms</h1>
                    </GridItem>
                  </GridContainer> 
    }


  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <LibraryBooksSharpIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total Books</p>
              <h3 className={classes.cardTitle}>{bookcount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>Recently Updated</div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <CategorySharpIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total categories</p>
               <h3 className={classes.cardTitle}>{categorycount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>Recently Updated</div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="warning">
                <GroupSharpIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total Users</p>
              <h3 className={classes.cardTitle}>{usercount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>Recently Updated</div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
        <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <CloudUploadIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total Files</p>
              <h3 className={classes.cardTitle}>{files}</h3>
            </CardHeader>
            <CardFooter stats>
             <div className={classes.stats}>Recently Updated</div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      {Content}

    </div>
  );
}
Dashboard.propTypes ={
  GetCategories: propTypes.func.isRequired,
  Getstats: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  items: state.items,
  stats: state.stats,
  categories: state.categories
});

export default connect(mapStateToProps, { GetCategories , Getstats , clearCategories})(Dashboard);