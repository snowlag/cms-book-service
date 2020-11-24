import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from '@material-ui/core/Typography';
import axios from "axios"
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/test.js";
import FileInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
//React Hook Form
import { useForm, ErrorMessage, Controller } from "react-hook-form";
//Redux
import { connect } from "react-redux";
import {addPoster} from "../../actions/posterAction.js"
import propTypes from "prop-types";
import { EditCategoryPoster} from "../../actions/Books.js"
import CircularProgress from '@material-ui/core/CircularProgress';
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
    textDecoration: "none"
  }
}));


const Editposter= (props)=> {
  const classes = useStyles();
  const [error , setError] = React.useState("")
  const [image, setPoster] = React.useState(null);
  const [disable, setVisibility] = React.useState(true);
  const { handleSubmit, errors, control } = useForm();
  const [ location , setLocation] = React.useState("")
  const [isChanged , SetChange] = React.useState(null)
  const [ loader , setLoader] = React.useState(null)



  const onSubmit = (item) => {
    setVisibility(true)
    setLoader(
      <CircularProgress visibility="hidden"  color="secondary" />
    )
    let formData = new FormData();
    formData.append('selectedImage', image);
    props.addPoster(formData);
    SetChange(true)
  
  };
   const HandleFileInput = event =>{
    event.preventDefault();
    setPoster(event.target.files[0])
    setVisibility(false)

   }
   useEffect( () => {
     
     var items={}
     if(isChanged){
      const {url} = props.poster; 
      setLocation(url.location);
      items.url = url.location;
      items.id = props.match.params.subid;
      items.name = props.match.params.name;
      items.type="Sub Category"
      props.EditCategoryPoster(items , props.history)
      }    
}, [props.poster])



useEffect( () => {
  setError(props.errors);
  setVisibility(false)
    setLoader(null)
}, [props.errors])


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h2 className={classes.cardTitleWhite}>Edit Poster</h2>
              </CardHeader>
              <CardBody>
                <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                <InputLabel style={{ color: "#AAAAAA" }}>
                      Upload Poster for the Category
                    </InputLabel>
                    <FileInput
                      id="image-file"
                      type="file"
                      control={control}
                      name="ImageFile"
                      onChange={HandleFileInput}
              
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    <FormHelperText>Poster size should be less than 2 mb</FormHelperText>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button disabled={disable} type="submit" color="rose">
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
          </GridItem>
         </GridContainer>
      </form>
    </div>
  );
}
Editposter.propTypes ={
 
  auth: propTypes.object.isRequired,
  EditCategoryPoster: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  poster : state.poster,
  items : state.items
});

export default connect(mapStateToProps, {addPoster , EditCategoryPoster})(Editposter);
