import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import { TablePagination } from '@material-ui/core';
// core components

import propTypes from "prop-types";

import { connect } from "react-redux";
import DateConverter from "DateConverter/dateconverter"

import {  GetTableActivities } from "../../actions/Books";
import { CircularProgress } from '@material-ui/core';


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
      textDecoration: "none"
    },
    header: {
        minHeight: "150px",
        width: "100%",
        padding: "10px",
        marginBottom: "30px"
    },
    headertitle: {
        marginLeft: "10px"
    },
    table: {
        marginTop: "20px"
    },
    formControl: {
        minWidth: 120,
        marginBottom: "20px"
      },
      searchButton: {
        marginTop: "10px"
      }
  };



const useStyles = makeStyles(styles);

const  ArchiveBooks = (props) =>{


//Material ui Table for words
const classes = useStyles();
//States for User list Tables 
const  [arr , setArr] = React.useState([]);
const [index , setIndex] = React.useState(-1);
const [disabled , setNext ] = React.useState(true)
const [prevItems , setPrev] = React.useState([])
const [flag , setFlag] = React.useState(false)
const [data , setData] = React.useState([]);
const [page , setPage] = React.useState(-1);
const [loader , setLoader] = React.useState(null)

const [state, setState] = React.useState({
    columns: [
      { title: "User", field: "user" },
      { title: "Action", field: "action" },
      { title: "Item_type", field: "item"} ,
      { title: "Item", field: "item_name"} ,
      { title: "Date", field: "date"}
    ]
  });


 useEffect( () => {
    var items = {}
    props. GetTableActivities(items)
     setLoader(
      <CircularProgress color="secondary" />
    )
    setFlag(true)
}, [props.auth])  
 





//Function to listen to new paginated data 
useEffect( () => {
    if(flag){
     //Push the next key in array
   setIndex(index+1)
   setArr([ ...arr , props.activities.Key])
   prevItems.push.apply(prevItems, props.activities.Activities);
   props.activities.Activities.map(data => {
    data.date = DateConverter(data.timestamp)
  })
  setLoader(null)
  setData(prevItems);
    }
   }, [props.activities])  
  


 // Load more Button to store previous state data and query for next paginated data
  const loadmore = (page) =>{
     console.log(`page = ${page}`)
     console.log(`index = ${index}`);
     if(page > index && arr[index]){
      setLoader(
        <CircularProgress color="secondary" />
      )
      var lastIndexKey = arr[index];
      setPrev(data);
  // Pass evaluated key and state contained dates
      props.GetTableActivities(lastIndexKey) 
     }
    }
  
  
// Logic to disable load more button when no key is recieved
useEffect( () => {
  if(props.activities.Key){
    setNext(false)
  }else{
    setNext(true)
  }
   
 } ,[props.activities.Key])



  return (
    <div>
       {loader} 
      <MaterialTable
         title="User Activities"
         className={classes.table}
         columns={state.columns}
         data={data.map(x => Object.assign({}, x))}
         options={{
          search: false,
          pageSize: 10
        }}
      icons={{LastPage: () => 
          <div />  
      },
        {
         FirstPage: () => 
           <div />
         }
        }
      onChangePage={(page) => {
          console.log(page);
          setPage(page)
          loadmore(page);
        }}
        components={{
         Pagination: props => (
                       <TablePagination
                       {...props}
                       rowsPerPage= {10}
                       rowsPerPageOptions={[10]}
                       
                   
                />
              ),
                    }}
      
    />
    {loader} 
    </div>
  );
}
ArchiveBooks.propTypes ={
     GetTableActivities: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  activities: state.activities
});

export default connect(mapStateToProps, { GetTableActivities})(ArchiveBooks);