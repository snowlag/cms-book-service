import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { connect } from "react-redux";
import {addBookFile} from "../../actions/posterAction.js"
import {UploadLink} from "../../actions/Books.js"
import propTypes from "prop-types";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
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

const AddBook = (props)=> {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [ file , setFile] = React.useState(null);
  const [ link , setLink] = React.useState("");
  const [ disable , setDisable] = React.useState(true);
  const [error , setError] = React.useState("");
  const [index , setIndex] = React.useState(false);
  const [ loader , setLoader] = React.useState(null)
  const onFileInput = event => {
    event.preventDefault();
    console.log(event.target);
    setFile(event.target.files[0])   
    console.log(file)       
  }
  const onLinkInput= event => {
       console.log(event.target.value);
         setLink(event.target.value);
        event.preventDefault();
  }
  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setDisable(false)   
  };

  const handleonSubmit = event => {
    setDisable(true);
    setLoader(
      <CircularProgress visibility="hidden"  color="secondary" />
    ) 
    console.log(value);
   if( value === "Direct Link" && link ){
        var item ={};
        item.medium = "DirectLink"
        item.url=link;
        console.log(link);
        item.id = props.match.params.id;
        item.name= props.match.params.name;
        item.type = props.match.params.type;
        props.UploadLink(item , props.history)
        setIndex(true);
        
   }else if(value === "S3 Upload" && file){
    let formData = new FormData();
    formData.append('files', file);
    console.log(formData)
    props.addBookFile(formData)
    setIndex(true)
        
   }else{
    setDisable(false);
    setLoader(null);
    setError({"message": "Please fill all feilds"});
   }
   event.preventDefault();
  };

  useEffect( () => {
    if(index){
    var items={}
    items.medium ="S3"
    setLink(props.file.url)
    console.log()
    items.url = props.file.url;
    items.id=props.match.params.id;
    items.name= props.match.params.name;
    items.type = props.match.params.type
    props.UploadLink(items , props.history)
    }
}, [props.file])

useEffect( () => {
   setError(props.errors);
   setDisable(false);
   setLoader(null)
}, [props.errors])



let fileupload;
if(value === "Direct Link"){
  fileupload =    <CustomInput
                     labelText="Provide Direct Link"
                     id="url"
                     onChange = {onLinkInput}
                     formControlProps={{
                       fullWidth: true
                     }}
                  />

}else if(value === "S3 Upload"){
    fileupload =   <CustomInput
                        id="file"
                        type="file"
                        onChange ={onFileInput}
                        formControlProps={{
                          fullWidth: true
                        }}
                        />
  
}
  

  return (
    <div>
      <form onSubmit={handleonSubmit}>
        
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                  <Card>
                      <CardHeader color="primary">
                        <h2 className={classes.cardTitleWhite}>Upload Book</h2>
                        <h3 className={classes.cardCategoryWhite}>You can either upload file or provide link</h3>
                      </CardHeader>
                      <CardBody>
                        <GridContainer>
                         <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
                          <GridItem xs={12} sm={12} md={12}>
                          <FormControlLabel value="Direct Link" control={<Radio />} label="Provide direct Link of file" />
                            {fileupload}  
                          </GridItem>                         
                         <GridItem xs={12} sm={12} md={12}>
                         <FormControlLabel value="S3 Upload" control={<Radio />} label="Upload file" />
                          </GridItem>
                          </RadioGroup> 
                        </GridContainer>
                      </CardBody>
                      <CardFooter>
                        <Button disabled ={disable} type="submit" color="primary">Upload</Button>
                        {loader}
                        {error.message && (
                           <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                             {error.message}
                          </Typography>
                        )} 
                      </CardFooter>
                    </Card>
                  </GridItem>
                </GridContainer>
            </form>
        </div>
  );
}
AddBook.propTypes ={
    registerUser: propTypes.func.isRequired,
    auth: propTypes.object.isRequired,
    addBookFile: propTypes.func.isRequired,
    UploadLink: propTypes.func.isRequired
  };
  const mapStateToProps =(state) =>({
    auth: state.auth,
    errors: state.errors,
    poster : state.poster,
    items: state.items,
    file: state.file
  });
  
  export default connect(mapStateToProps, {addBookFile, UploadLink })(AddBook);