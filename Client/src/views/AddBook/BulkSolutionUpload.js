import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/test.js";
import MultipleInput from "components/CustomInput/MultipleInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { connect } from "react-redux";
import {addChapterFile} from "../../actions/posterAction.js"
import {UploadBulk ,  clearMybooks , clearCategories , clearSubcategories , clearSubbooks} from "../../actions/Books.js"
import propTypes from "prop-types";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
//React Hook Form
import { useForm, ErrorMessage, Controller } from "react-hook-form";


const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
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
    
  }
}));

const AddSolution = (props)=> {

  const [error , setError] = React.useState("")
  const classes = useStyles();
  const { handleSubmit, errors, control } = useForm();
 const [arr , setArr] = React.useState([])
const [ disable , setDisable] = React.useState(true);
const [ loader , setLoader] = React.useState(null)
const [flag , setFlag] = React.useState(false)


  const fileInput = (event)=>{
    setFlag(true)
    const flag = event.target.files.length;
    console.log(flag);
    var files = event.target.files;
    console.log(files);
    setDisable(false);


    var items =[]
    for (let i = 0; i < files.length; i++) {
     items.push(files[i])
   }
    setArr(items)
  }

  const onSubmit = (item) => {
    if(flag){
    setDisable(true);
    //Do Validation of the link
    item.Chapters.map(chapter => {
      if(chapter.url.includes('1drv.ms')){
        chapter.url =  chapter.url.replace('1drv.ms','1drv.ws')
      }
    })

  
  setLoader(
    <CircularProgress visibility="hidden"  color="secondary" />
  )
  item.id = props.match.params.id;
  item.type = "Solution";
  item.name=props.match.params.name;
  item.Btype = props.match.params.type;
  console.log(item);
  props.UploadBulk(item , props.history);
    }
  }
  useEffect( () => {    
    props.clearCategories();
    props.clearMybooks();
    props.clearSubbooks();
    props.clearSubcategories();
   }, [props.auth])
   
   useEffect( () => {
     setError(props.errors)
     setDisable(false)
     setLoader(null)
   }, [props.errors])


  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardBody>
            <h3
            style ={{display : "inline"}}
            >Select Files
            </h3>
            <MultipleInput
                        id="file"
                        type="file"
                        onChange={fileInput}
                        formControlProps={{
                          fullWidth: true
                        }}
                        />
          </CardBody>
        </Card>
      </GridItem>
          <GridItem xs={12} sm={12} md={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                 <CardHeader color="primary">
                    <h2 className={classes.cardTitleWhite}>Bulk Upload</h2>
                      <h3 className={classes.cardCategoryWhite}>Add Solutions</h3>
                  </CardHeader>
                  <CardBody>
                  {arr.map((file , index)=> 
                     <GridContainer>
                     <GridItem xs={12} sm={12} md={4}>
                     <CustomInput
                         labelText="Index"
                         id="book_name"
                         type="number"
                         value={index+1}
                         name={`Chapters[${index}].index`}
                         control={control}
                         formControlProps={{
                           fullWidth: true
                         }}
                       />
                     </GridItem>
                     <GridItem xs={12} sm={12} md={4}>
                     <CustomInput
                         labelText="Name"
                         id="book_name"
                         name={`Chapters[${index}].chapter_name`}
                         value={file.name.replace(".pdf", "")}
                         control={control}
                         formControlProps={{
                           fullWidth: true
                         }}
                       />
                     </GridItem>
                     <GridItem xs={12} sm={12} md={4}>
                     <CustomInput
                         labelText="Url"
                         id="url"
                         name={`Chapters[${index}].url`}
                         control={control}
                         formControlProps={{
                           fullWidth: true
                         }}
                       />
                     </GridItem>
                    </GridContainer>
                  )}
                                 
                  </CardBody>
                  <CardFooter>
                      <Button disabled ={disable} type="submit" color="rose">
                        Upload
                    </Button>
                    {loader}
                    {error.message && (
                     <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                     {error.message}
                    </Typography>
                  )} 
                  </CardFooter>
              </Card>
              </form>
          </GridItem>
  </GridContainer>
  );
}
AddSolution.propTypes ={
    registerUser: propTypes.func.isRequired,
    auth: propTypes.object.isRequired,
    addChapterFile: propTypes.func.isRequired,
    UploadBulk: propTypes.func.isRequired
  };
  const mapStateToProps =(state) =>({
    auth: state.auth,
    errors: state.errors,
    poster : state.poster,
    items: state.items,
    file: state.file
  });
  
  export default connect(mapStateToProps, 
    {
    addChapterFile,
     UploadBulk, 
      clearMybooks , 
    clearCategories,  
    clearSubcategories , 
    clearSubbooks })(AddSolution);