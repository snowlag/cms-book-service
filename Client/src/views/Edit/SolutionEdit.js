import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import TextInput from "components/CustomInput/test.js";
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
import {addSolutionFile} from "../../actions/posterAction.js"
import {EditItem , ViewSolution} from "../../actions/Books.js"
import propTypes from "prop-types";
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
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

const Editsolution = (props)=> {

  const { handleSubmit, errors, control } = useForm();

  const classes = useStyles();
  const [value, setValue] = React.useState('Direct Link');
  const [name, setSolution] = React.useState('');
  const [ file , setFile] = React.useState(null);
  const [ link , setLink] = React.useState("");
  const [ disable , setDisable] = React.useState(true);
  const [error , setError] = React.useState("");
  const [index , setIndex] = React.useState(false);
  const [Solutions , setSolutions ] = React.useState([]);
  const [ solutionIndex , setSolutionIndex] = React.useState("");
  const [loading , setLoading] = React.useState(true);
  const [ loader , setLoader] = React.useState(null);
  const [disabled, setVisibility] = React.useState(true);
  useEffect( () => {
    props.ViewSolution(props.match.params.id)
  } ,[props.auth])

  useEffect( () => {
    setLoading(false);
    const {Solution} = props.items
    setSolutions(props.items.Solution);
    Solution.map((solution) => {
    setSolutionIndex(solution.index);
    setSolution(solution.chapter_name);
    setLink(solution.url);
  })
}, [props.items.Solution])



  const onFileInput = event => {
    event.preventDefault();
    console.log(event.target);
    setFile(event.target.files[0])   
    console.log(file)  
    setVisibility(false)
  }
  
  const onLinkInput= event => {
      if(event){
        setLink(event.target.value);
        event.preventDefault();
        setVisibility(false)
      }      
  }
  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setDisable(false)   
  };

  const onSubmit = (item) => {
    setVisibility(true)
    setLoader(
      <CircularProgress visibility="hidden"  color="secondary" />
    )
    setSolutionIndex(item.index);
    setSolution(item.name)
   if( value === "Direct Link" && link ){
        item.type="Solution"
        item.medium = "DirectLink"
        item.url=link;
        item.id = props.match.params.id
        item.Btype = props.match.params.type
        props.EditItem(item , props.history)
        setIndex(true);
        
   }else if(value === "S3 Upload" && file){
    let formData = new FormData();
    formData.append('files', file);
    console.log(formData);
    props.addSolutionFile(formData);
    setIndex(true);

   }
  };

  useEffect( () => {
    if(index){

    var items={}
    items.medium ="S3"
    setLink(props.file.url)
    console.log()
    items.index = solutionIndex;
    items.name =name;
    items.type="Solution"
    items.url = props.file.url;
    items.id=props.match.params.id
    items.Btype = props.match.params.type
    props.EditItem(items , props.history)
    }
}, [props.file])

useEffect( () => {
   setError(props.errors);
   setVisibility(false)
   setLoader(null)
}, [props.errors])



let fileupload;
if(value === "Direct Link"){
  fileupload =    <CustomInput
                     labelText="Provide Direct Link"
                     id="url"
                     value ={link}
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
      <form onSubmit={handleSubmit(onSubmit)}>
        
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                  <Card>
                      <CardHeader color="primary">
                        <h2 className={classes.cardTitleWhite}>Edit Solution</h2>
                        <h3 className={classes.cardCategoryWhite}>You can either upload file or provide link</h3>
                      </CardHeader>
                      <CardBody>
                      {Solutions.map((solution) => 
                        <GridContainer>
                        <GridItem xs={12} sm={12} md={4}>
                            <TextInput
                            name="index"
                            value ={solution.index}
                            type="number"
                            control={control}
                            labelText="Chapter Number"
                             formControlProps={{
                              fullWidth: true
                            }}
                        />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={8}>
                            <TextInput
                            name="name"
                            value ={solution.chapter_name}
                            control={control}
                            labelText="Name of the Solution"
                            formControlProps={{
                              fullWidth: true
                            }}
                        />
                        </GridItem>
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
                      )}
                      </CardBody>
                      <CardFooter>
                        <Button disabled ={disabled} type="submit" color="primary">Upload</Button>
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
Editsolution.propTypes ={
    registerUser: propTypes.func.isRequired,
    auth: propTypes.object.isRequired,
    addSolutionFile: propTypes.func.isRequired,
    EditItem: propTypes.func.isRequired,
    ViewSolution: propTypes.func.isRequired,
    
  };
  const mapStateToProps =(state) =>({
    auth: state.auth,
    errors: state.errors,
    poster : state.poster,
    items: state.items,
    file: state.file
  });
  
  export default connect(mapStateToProps, {addSolutionFile, EditItem , ViewSolution})(Editsolution);