import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardBooklg from "components/Card/CardBooklg.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CardBookDescription from "components/Card/CardBookDescription";
import List from "components/Lists/lists";
import { connect } from "react-redux";
import Button from "components/CustomButtons/Button.js";
import {ViewBookPage , SwitchArchive} from "../../actions/Books.js"
import propTypes from "prop-types";
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from '@material-ui/core/CircularProgress';
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
    textDecoration: "none",
    display: "inline"
  },
  IconButton:{
    float: "right",
    display: "inline",
    marginTop: "20px",
    marginRight: "10px",
    
  },
  ArchiveButton:{
    float: "right",
    display: "inline",
    marginTop: "15px",
    marginRight: "10px",
    
  }
};

const useStyles = makeStyles(styles);

const BookPage = (props)=> {
  const [ books , setBooks] = React.useState([]);
  const [ bookName , setBookName] = React.useState("");
  const [ author , setAuthor] = React.useState("");
  const [ description , setDescription] = React.useState("");
  const [ chapters , setChapters] = React.useState([])
  const [ solutions , setSolutions] = React.useState([])
  const [ bookloading , setBookLoading] = React.useState(true)
  const [ chapterloading , setChapterLoading] = React.useState(true)
  const [ solutionloading , setSolutionLoading] = React.useState(true)
  const [ book_url , setIsBook] =React.useState(false);
  const [cindex , setChapterIndex ] = React.useState(0);
  const [sindex , setSolutionIndex ] = React.useState(0);
  const [ loader , setLoader] = React.useState(null)



  useEffect( () => {
    axios
    .get(`/api/getChild/Chapter/${props.match.params.id}`)
     .then(res =>{
      // setChapters(res.data);
      setChapters(res.data.sort((a , b) =>{
        return parseInt(a.index)  - parseInt(b.index)
      }))
   
       setChapterLoading(false);
      } )
     .catch(err =>{
        console.log(err);
     });  

  } ,[props.auth])

  useEffect( () => {
    axios
    .get(`/api/getChild/Solution/${props.match.params.id}`)
     .then(res =>{
      setSolutions(res.data.sort((a , b) =>{
        return parseInt(a.index)  - parseInt(b.index)
      }));
      setSolutionLoading(false);
      } )
     .catch(err =>{
        console.log(err);
     });   
  } ,[props.auth])


const switchToArchive = () => {

  setLoader(
    <CircularProgress visibility="hidden" style={{float : "right"}}  color="secondary" />
  )
var data = {}
  books.map((book) => {
    data = book
 })

 axios.put("/api/archiveSwitch", {data})
 .then(res => {
  props.history.push(`/admin/ViewBook/${res.data.type}/${ data.id}`)
  props.history.go()
  setLoader(false);
 }
  )
 .catch(err =>{
  setLoader(false);
  console.log(err)

 }
 
  );
}

  
 const addbook = ()=> {
  let name;
  books.map((book) => {
     name = book.book_name;
  })
  props.history.push("/admin/ViewBook/"+ props.match.params.type+ "/" + props.match.params.id + "/UploadBook/"+ name)
}



const addchapter = ()=> {
  var largest = 0
  if(chapters.length === 1){
    largest = parseInt(chapters[0].index);
  }else{
  chapters.sort(function(a, b) {
    largest = parseInt(a.index) 
    largest =  parseInt(a.index) > parseInt(b.index) ? parseInt(a.index): parseInt(b.index);
 });
}
 largest = parseInt(largest+1);
 props.history.push("/admin/ViewBook/"+props.match.params.type+"/" + props.match.params.id + "/UploadChapter/" +  largest)
}






const deleteBook = () =>{
let name;
  books.map((book) => {
     name = book.book_name
  })
  setLoader(
    <CircularProgress visibility="hidden" style={{float : "right"}}  color="secondary" />
  )
  axios.delete(`/api/deleteBook/${props.match.params.id}/${name}/${props.match.params.type}`)
   .then((res) => {
      props.history.push("/admin/Dashboard");
   })
   .catch((err) => {
    setLoader(null);
   })
}




const addsolution = ()=> {
  var largest = 0
  if(solutions.length === 1){
    largest = parseInt(solutions[0].index);
  }else{
  solutions.sort(function(a, b) {
    largest = parseInt(a.index) 
    largest =  parseInt(a.index) > parseInt(b.index) ? parseInt(a.index): parseInt(b.index);
 });
}
largest = parseInt(largest+1);
 props.history.push("/admin/ViewBook/"+props.match.params.type+"/" + props.match.params.id + "/UploadSolution/" + largest)
}

const BulkChapter = () =>{
  let name;
  books.map((book) => {
    name = book.book_name;
 })
  props.history.push("/admin/ViewBook/"+props.match.params.type+"/" + props.match.params.id + "/Bulkchapters/"+ name)
}

const BulkSolution = () =>{
  let name; 
  books.map((book) => {
    name = book.book_name;
 })
  props.history.push("/admin/ViewBook/"+props.match.params.type+"/" + props.match.params.id + "/Bulksolutions/" + name)
}


 useEffect( () => {
   props.ViewBookPage(props.match.params.id , props.match.params.type)
 } ,[props.auth])

 useEffect( () => {
   setBooks(props.items.Books);
   console.log(props.items.Books);
   setBookLoading(false);
   console.log(book_url)
 }, [props.items.Books])
 
 
 useEffect( () => {
  setLoader(null)
}, [props.errors])



 let chapterlist;
  if(chapterloading){
    chapterlist=  <CardBody>
                     <LinearProgress color="secondary"/>
                 </CardBody>



  }else if(chapters.length > 0){
    chapterlist =  <CardBody>
                      {chapters.map((chapter) =>
                      <List
                        label = {chapter.chapter_name}
                        index = {chapter.index}
                        bookid = {props.match.params.id}
                        type ="Chapter"
                        Btype= {props.match.params.type}
                        id={chapter.id}
                        DownloadLink={chapter.url}
                        history={props.history}
                       /> 
                       )}
                       
                      </CardBody>

  }else{
    chapterlist = <CardBody>
                     <h4>No Chapters</h4>
                  </CardBody>

  }

  let  solutionlist;
  if(solutionloading){
    solutionlist=  <CardBody>
                     <LinearProgress color="secondary"/>
                   </CardBody>

  }else if(solutions.length > 0){
     solutionlist = <CardBody>
                       {solutions.map((solution) =>
                       <List
                         label = {solution.chapter_name}
                         id={solution.id}
                         bookid = {props.match.params.id}
                         index={solution.index}
                         type ="Solution"
                         Btype= {props.match.params.type}
                         DownloadLink={solution.url}
                         history={props.history}
                        /> )}
                       </CardBody>


  }else{
    solutionlist=  <CardBody>
                     <h4>No Solutions</h4>
                   </CardBody>
    
  }

  let booklist;
  let del;
  if(bookloading){
    booklist = <CardBody>
                  <LinearProgress color="secondary"/>
                </CardBody>


  }else if(books.length > 0){
    booklist=  <CardBody>
                {books.map((book) => 
                  <List
                    label={book.book_name}
                    id={book.id}
                    bookid = {props.match.params.id}
                    deleteBook= {deleteBook}
                    type={book.type}
                    Btype= {book.type}
                    DownloadLink={book.url}
                    history={props.history}
                  />
                  )}
                  </CardBody>

  }else{
    booklist=      <CardBody>                  
                   </CardBody>
    

  }

  const classes = useStyles();
 if(loader){
    del = loader;

  }else{
    del =  <DeleteIcon onClick={deleteBook} className ={classes.IconButton} />
  }


let ArchiveButton
 if(props.match.params.type === "Book"){
  ArchiveButton = <Button
                  className ={classes.ArchiveButton}
                  color="warning"
                  onClick={switchToArchive}
                      >
                  Archive
                 </Button>
 }else{
  ArchiveButton = <Button
  className ={classes.ArchiveButton}
  color="warning"
  onClick={switchToArchive}
      >
  Publish
 </Button>

 }




  return (
    <>
    {books.map((book) => 
    <GridContainer>
    
       <Card>
       <CardHeader color="primary">
        <h1 className={classes.cardTitleWhite}>{book.book_name}</h1>
        {del}
        {ArchiveButton}
       </CardHeader>
       <CardBody>
         <GridContainer>
           <GridItem xs={12} sm={12} md={4}>
             <CardBooklg image={book.poster} title={book.book_name} id={book.id}/>
           </GridItem>
           <GridItem xs={12} sm={12} md={8}>
             <CardBookDescription
               Title="Description"
               Description={book.description}
               Author={book.author}
               id={book.id}
               type={book.type}
               book_name = {book.book_name}
               lang = {book.lang}
               tags = {book.tags}
             />
           </GridItem>
         </GridContainer>
       </CardBody>
     </Card>
      
      
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h1 className={classes.cardTitleWhite}>Download Complete Book</h1>
              <AddIcon onClick={addbook} className ={classes.IconButton} />
            </CardHeader>
             {booklist}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h1 className={classes.cardTitleWhite}>Download Chapters ({book.chapters})</h1>
             <AddIcon onClick={addchapter} className ={classes.IconButton} />
             <CloudUploadIcon onClick={BulkChapter} className ={classes.IconButton}/>
             <h3 className={classes.cardCategoryWhite}>Chapter List</h3>
             <br/>
            </CardHeader>
              {chapterlist}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h1 className={classes.cardTitleWhite}>Download Solutions  ({book.solutions})</h1>
              <AddIcon onClick={addsolution} className ={classes.IconButton} />
              <CloudUploadIcon onClick={BulkSolution} className ={classes.IconButton}/>            
              <h3 className={classes.cardCategoryWhite}>Solution Lists</h3>
            </CardHeader>
            {solutionlist}
          </Card>
        </GridItem>
      </GridContainer>
    </GridContainer>
    )}
    </>
  );
}

BookPage.propTypes ={
  ViewSubcategories: propTypes.func.isRequired,
  SwitchArchive: propTypes.func.isRequired,
  id: propTypes.string,
  type:propTypes.string
 };
 const mapStateToProps =(state) =>({
   auth: state.auth,
   errors: state.errors,
   items: state.items
 });
 
 export default connect(mapStateToProps, {ViewBookPage ,  SwitchArchive})(BookPage);
 