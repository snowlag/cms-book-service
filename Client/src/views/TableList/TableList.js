import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import { TablePagination } from '@material-ui/core';
// core components

import propTypes from "prop-types";

import { connect } from "react-redux";


import { GetTableBooks } from "../../actions/Books";

import axios from 'axios'
import { CircularProgress } from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DateConverter from "DateConverter/dateconverter"

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
      { title: "Book", field: "book_name" },
      { title: "Category", field: "category" },
      { title: "Sub Category", field: "subcategory" },
      { title: "Uploaded by", field: "User"} ,
      {title: "Date" , field: "date"}
    ]
  });

 

 useEffect( () => {
    var items = {}
    props.GetTableBooks(items)
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
   setArr([ ...arr , props.books.Key])
   prevItems.push.apply(prevItems, props.books.Books);
  setLoader(null)
  props.books.Books.map(data => {
    data.date = DateConverter(data.timestamp)
  })
  setData(prevItems);
    }
   }, [props.books])  
  


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
      props.GetTableBooks(lastIndexKey) 
     }
    }
  
  
// Logic to disable load more button when no key is recieved
useEffect( () => {
  if(props.books.Key){
    setNext(false)
  }else{
    setNext(true)
  }
   
 } ,[props.books.Key])


//Reset to clear states when new search is made
  const reset =() => {
      setData([])
      //Reset the array
      setArr([]);
      //reset the previous date
      setPrev([]);
      setIndex(-1)
  }

const RemoveArchive =  (evt , data) => {
    setLoader(
      <CircularProgress color="secondary" />
    )
    axios
     .put(`/api/archiveSwitch` , {data} )
     .then(res => {
        var key ={}
        reset();
        props.GetTableBooks(key)
        
     })
     .catch( err => {
       setLoader(null)
       console.log(err)
     }
   );
}

//Edit Book Page Link
const editBook = (event , rowData) =>{
    const link = "/admin/ViewBook/Book/" + rowData.id
    props.history.push(link);
  }

  const deleteBook = (event , rowData) => {
    setLoader(
      <CircularProgress color="secondary" />
    )
   axios.delete(`/api/deleteBook/${rowData.id}/${rowData.book_name}/Book`)
   .then((res) => {
    var key ={}
        reset();
        props.GetTableBooks(key)
        setLoader(null)
   })
   .catch((err) => {
     console.log(err)
     alert("Error occured while deleting this book")
     setLoader(null)
   })
  }

  return (
    <div>
       {loader} 
      <MaterialTable
         title="Book List"
         className={classes.table}
         columns={state.columns}
         data={data.map(x => Object.assign({}, x))}
         options={{
          pageSize: 10
        }}
        actions={[
              {
                icon: 'edit',
                onClick: editBook
              },
              {
                icon: 'delete',
                onClick: deleteBook
              },
              
              {
                  icon: () =>  <RemoveCircleIcon />,
                  onClick: RemoveArchive
              },

        ]}
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
    GetTableBooks: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  books: state.books
});

export default connect(mapStateToProps, {GetTableBooks})(ArchiveBooks);