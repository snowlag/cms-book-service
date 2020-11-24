import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from '@material-ui/core/Typography';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import FileInput from "components/CustomInput/CustomInput.js";
import CustomInput from "components/CustomInput/test.js";
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
import {PostCategory,PostSubCategory ,GetAllCategories ,clearMybooks , clearCategories , clearSubcategories , clearSubbooks} from "../../actions/Books.js"
import propTypes from "prop-types";
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';



//Drop Zone for file upload
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

const AddCategory = (props) =>{

  const classes = useStyles();
  //Declaring States
  const [error , setError] = React.useState("")
  const [categories, setCategories] = React.useState([]);
  const { handleSubmit, errors, control } = useForm();
  const { handleSubmit: handleSubmit2, errors : errors2, control: control2 } = useForm({
    mode: "onBlur"
  });
;
  const [ location , setLocation] = React.useState("");
  const [category , setCategory] = React.useState("")
  const [image, setPoster] = React.useState(null);
  const [disable, setVisibility] = React.useState(true);
  const [disabled, setDisable] = React.useState(true);
  const [name ,setName] = React.useState("");
  const [desc ,setDesc] = React.useState("");
  const [isCategory , SetIsCategory] = React.useState(null);
  //Loaders in the form
  const [ catloader , setCatLoader] = React.useState(null);
  const [ subloader , setSubLoader] = React.useState(null)
  const [ cat_subtitle , setCatSubtitle] = React.useState("");
  const [ sub_subtitle , setSubSubtitle] = React.useState("");

  //Clear states
  useEffect( () => {    
    props.clearCategories();
    props.clearMybooks();
    props.clearSubbooks();
    props.clearSubcategories();
   }, [props.auth])




  //To be executed after submit  the form of adding category
  const onSubmit = (item) => {
    if(image){
    //hide the Button
    setVisibility(true)
    //Turn on the loader
    setCatLoader(
      <CircularProgress visibility="hidden"  color="secondary" />
    )
    SetIsCategory(true)
    console.log(item)
    setName(item.name);
    setDesc(item.desc);
    setCatSubtitle(item.subtitle)
    let formData = new FormData();
    formData.append('selectedImage', image);
    //Upload Poster to Aws s3
    props.addPoster(formData);
    }else{
      setVisibility(false);
      setCatLoader(null);   
    }
  
  };
  //To be executed after submitting the Sub Category form
  const onSubmit2 = (item) => {
    if(image){
    setDisable(true)
    setSubLoader(
      <CircularProgress visibility="hidden"  color="secondary" />
    )
    SetIsCategory(false)
    console.log(item)
    setName(item.name);
    setDesc(item.desc);
    setSubSubtitle(item.subtitle)
    let formData = new FormData();
    formData.append('selectedImage', image);
    // Upload Poster to Aws s3
    props.addPoster(formData);
    }else{
      setVisibility(false);
      setCatLoader(null);  
    }
  
  };
  
   const HandleOpen = event => {
    props.GetAllCategories()
   }

   const handleChange = (event) => {
    setCategory(event.target.value);
  };


   const HandleFileInput = event =>{
    setVisibility(false)
    SetIsCategory(true)
    event.preventDefault();
    setPoster(event.target.files[0])
    console.log(event.target.files[0])
    
   }
   const HandleFileInput2 = event =>{
    SetIsCategory(false)
    setDisable(false);
    event.preventDefault();
    setPoster(event.target.files[0])
    console.log(event.target.files[0])  
   }
   useEffect( () => {
    var items={}
    //Check if the Poster is for Category or Sub Category
    if(isCategory){
    const {url} = props.poster;
    setLocation(url.location);
    items.location = url.location;
    items.name = name;
    items.desc = desc;
    items.type = "Category"
    items.subtitle = cat_subtitle
    console.log(items);
    props.PostCategory(items , props.history);  
 } else if(!isCategory){
  const {url} = props.poster;
   setLocation(url.location);
   items.location = url.location;
   items.parent = category;
   items.name = name;
   items.desc = desc;
   items.type="Sub Category";
   items.subtitle = sub_subtitle
   console.log(items)
   props.PostSubCategory(items , props.history);  
 }
}, [props.poster])


useEffect( () => {
  setError(props.errors)
  setVisibility(false);
  setDisable(false)
    setCatLoader(null);
    setSubLoader(null)
}, [props.errors])


useEffect( () => {
  setCategories(props.items.Categories);
}, [props.items])


  return (
    <div>
      <form key={1} onSubmit={handleSubmit(onSubmit)}>
      <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h2 className={classes.cardTitleWhite}>New Category</h2>
                <h3 className={classes.cardCategoryWhite}>
                  Add new Category Details
                </h3>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      name="name"
                      labelText="Name of the Category"
                      id="cat_name"
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
                      name="subtitle"
                      labelText="Subtitle for the Category"
                      id="description"
                      control= {control}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <InputLabel style={{ color: "#AAAAAA" }}>
                      Description
                    </InputLabel>
                    <CustomInput
                      name="desc"
                      labelText="Tell us what type of books these category will contain."
                      id="description"
                      control= {control}
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
                      Poster
                    </InputLabel>
                    <FileInput
                      id="image-file"
                      onChange={HandleFileInput}
                      type="file"
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                     <FormHelperText>Poster size should be less than 2 mb</FormHelperText>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button disabled={disable} type="submit" color="primary">
                  Add
                </Button>
                {catloader}
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
      <form key={2} onSubmit={handleSubmit2(onSubmit2)}>
        <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="rose">
              <h2 className={classes.cardTitleWhite}>Add Sub Category</h2>
              <h3 className={classes.cardCategoryWhite}>
                Enter Sub Category details
              </h3>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={category}
                      onOpen={HandleOpen}
                      onChange={handleChange}
                    >  
                   
                    {categories.map((category) => 
                      <MenuItem value={category.id}>{category.category_name}</MenuItem>
                    )}

                    </Select>
                  </FormControl>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Name of the Sub Category"
                    id="category_name"
                    type="text"
                    name="name"
                    control={control2}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      name="subtitle"
                      labelText="Subtitle for the Category"
                      control= {control2}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                <InputLabel style={{ color: "#AAAAAA" }}>
                      Description
                  </InputLabel>
                <CustomInput
                      name="desc"
                      labelText="Description of the SubCategory."
                      id="description"
                      control= {control2}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 3
                      }}
                    />
                </GridItem>
              </GridContainer>
              <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: "#AAAAAA" }}>
                      Poster
                    </InputLabel>
                    <FileInput
                      id="image-file"
                      type="file"
                      onChange={HandleFileInput2}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <FormHelperText>Poster size should be less than 2 mb</FormHelperText>
                  </GridItem>
                </GridContainer>
            </CardBody>
            <CardFooter>
              <Button  disabled={disabled} type="submit" color="rose">Add</Button>
              {subloader}
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      </form>
    </div>
  );
}
AddCategory.propTypes ={
  registerUser: propTypes.func.isRequired,
  auth: propTypes.object.isRequired,
  loginUser: propTypes.func.isRequired,
  addPoster: propTypes.func.isRequired,
  PostCategory: propTypes.func.isRequired,
  GetCategories: propTypes.func.isRequired,
  PostSubCategory: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  poster : state.poster,
  items: state.items
});

export default connect(mapStateToProps, {addPoster, 
   PostCategory ,
    GetAllCategories ,
    PostSubCategory,
    clearMybooks , 
    clearCategories,  
    clearSubcategories , 
    clearSubbooks
  })(AddCategory);