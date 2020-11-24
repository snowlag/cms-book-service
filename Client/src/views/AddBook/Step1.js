import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from '@material-ui/core/Typography';
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
import {GetAllSubCategories ,GetAllCategories, PostBook , clearMybooks , clearCategories , clearSubcategories , clearSubbooks} from "../../actions/Books.js"
import CircularProgress from '@material-ui/core/CircularProgress';
import { setEmitFlags } from "typescript";

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


const AddBook= (props)=> {
  const classes = useStyles();
  //React States
  const [error , setError] = React.useState("")
  const [id, setId] = React.useState("");
  const [catId, setCatId] = React.useState("");
  const [subcategories, setSubCategories] = React.useState([]);
  const [image, setPoster] = React.useState(null);
  const [disable, setVisibility] = React.useState(true);
  const { handleSubmit, errors, control } = useForm();
  const [ location , setLocation] = React.useState("")
  const [isChanged , SetChange] = React.useState(null)
  const [name ,setName] = React.useState("");
  const [desc ,setDesc] = React.useState("");
  const [author , setAuthor] = React.useState("");
  const [ loader , setLoader] = React.useState(null)
  const [categories, setCategories] = React.useState([]);
  const [language , setLang] = React.useState("English");
  const [tags , setTags] = React.useState("");
  //Event Functions
  const handleChange = event => {
    setId(event.target.value);
  };
 const handleCatChange = event => {
  setCatId(event.target.value);
  props.GetAllSubCategories(event.target.value)
};
 const HandleCatOpen = event =>{
  props.GetAllCategories();
 }



  const onSubmit = (item) => {
    if(catId && id){
      setVisibility(true)
    setLoader(
      <CircularProgress visibility="hidden"  color="secondary" />
    )
    SetChange(true);
    setName(item.name);
    setDesc(item.desc);
    setAuthor(item.author);
    setTags(item.tags);

    let formData = new FormData();
    formData.append('selectedImage', image);
    //Upload Poster to Aws s3
    console.log(image);
    setLang(language);
    props.addPoster(formData);
  
    }
    
  };
   const HandleFileInput = event =>{
    event.preventDefault();
    setPoster(event.target.files[0])
    setVisibility(false)

   }
   useEffect( () => {
     
     var items={}
     if(isChanged){
      console.log(language)
      console.log(props.poster);
      const {url} = props.poster;
      setLocation(url.location);
      items.name= name;
      items.description = desc;
      items.author = author;
      items.poster = url.location;
      items.status = "Not Uploaded Files";
      items.type = "A_Book";
      items.subcategory_id = id;
      items.language=  language;
      items.tags = tags
      items.cat_id= catId;
     
      if(props.items.Categories){
        items.category = props.items.Categories.find(o => o.id === catId).category_name
      }
      //add subcategory name
      if(props.items.SubCategories){
        items.subcategory = props.items.SubCategories.find(o => o.id === id).category_name
      }
      console.log(items);
      props.PostBook(items , props.history);
     }
}, [props.poster])

useEffect( () => {    
 props.clearCategories();
 props.clearMybooks();
 props.clearSubbooks();
 props.clearSubcategories();
}, [props.auth])

useEffect( () => {
  setError(props.errors)
  setVisibility(false)
  setLoader(null)
}, [props.errors])


useEffect( () => {
  setCategories(props.items.Categories);
  //Route
}, [props.items.Categories])



useEffect( () => {
  setSubCategories(props.items.SubCategories);
}, [props.items.SubCategories])


const handlelangChange = (event) => {
  setLang(event.target.value);
}

//languages to be selected by user
const languages = [
  "English",
  "Hindi",
  "Bengali",
  "Marathi",
  "Gujrati",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
  "Urdu",
  "Nepali"
]


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h2 className={classes.cardTitleWhite}>Step 1</h2>
                <h3 className={classes.cardCategoryWhite}>Add Book Details</h3>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={catId}
                      onOpen={HandleCatOpen}
                      onChange={handleCatChange}
                    >  
                    {categories.map((category) => 
                      <MenuItem value={category.id}>{category.category_name}</MenuItem>
                    )}

                    </Select>
                  </FormControl>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-simple-select-label">
                        Sub Category
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={id}
                        onChange={handleChange}
                      >
                          
                    {subcategories.map((category) => 
                      <MenuItem value={category.id}>{category.category_name}</MenuItem>
                    )}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                      labelText="Name of the Book"
                      id="book_name"
                      name="name"
                      control={control}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                      labelText="Name of the Author"
                      id="Author_name"
                      name="author"
                      control={control}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>                 
                </GridContainer>
                <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                <FormControl style = {{marginTop: "25px" , width: "100px"}} className={classes.formControl}>
                    <InputLabel id="select-lang">
                      Language
                    </InputLabel>
                    <Select
                      labelId="select-lang"
                      id="demo-simple-select-lang"
                      value={language}
                      onChange={handlelangChange}
                    >                    
                      {languages.map((language) => 
                      <MenuItem value={language}>{language}</MenuItem>
                    )}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={8}>
                <CustomInput
                      labelText="Tags(provide comma seperated tags)"
                      id="tags"
                      name="tags"
                      required = {false} 
                      control={control}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Enter the Description of the book"
                      id="Description"
                      name="desc"
                      control={control}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 5
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                <InputLabel style={{ color: "#AAAAAA" }}>
                      Upload Poster for the Book
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
                  Next
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
AddBook.propTypes ={
 
  auth: propTypes.object.isRequired,
  GetSubCategories: propTypes.func.isRequired,
  addPoster: propTypes.func.isRequired,
  PostBook: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  poster : state.poster,
  items : state.items
});

export default connect(mapStateToProps, {addPoster ,
  GetAllCategories,
   GetAllSubCategories ,
    PostBook ,
    clearMybooks , 
    clearCategories,  
    clearSubcategories , 
    clearSubbooks
  })(AddBook);