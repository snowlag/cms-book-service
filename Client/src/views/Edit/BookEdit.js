import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
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
import propTypes from "prop-types";
import {GetSubCategories , EditBook , ViewSubcategories ,GetCategories} from "../../actions/Books.js"
import {ViewBookPage} from "../../actions/Books.js"
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


const Editbook= (props)=> {

  const { handleSubmit, errors, control } = useForm();

  const classes = useStyles();
  const [error , setError] = React.useState("")

  const [subcategory, setSubCategory] = React.useState("");
  const [subcategories, setSubCategories] = React.useState([]);

  const [category, setCategory] = React.useState("");

  const [image, setPoster] = React.useState(null);
  const [ location , setLocation] = React.useState("")
  const [isChanged , SetChange] = React.useState(null)
  const [name ,setName] = React.useState("");
  const [desc ,setDesc] = React.useState("");
  const [author , setAuthor] = React.useState("");
  const [books , setBook] = React.useState([])
  const [ bookloading , setBookLoading] = React.useState(true)
  const [author_id , setAuthorid] = React.useState()
  const [ id , setId] = React.useState();
  const [ loader , setLoader] = React.useState(null);
  const [disable, setVisibility] = React.useState(false);
  const [type , setType] = React.useState("");
  const [tags , setTags] = React.useState([])
  const [language , setLang] = React.useState(null);
 useEffect( () => {
  props.ViewBookPage(props.match.params.id, props.match.params.type);
} ,[props.auth])

  const handleChange = event => {
    setSubCategory(event.target.value);
  };
  
 useEffect( () => {
    setBook(props.items.Books);
    setBookLoading(false);
    const {Books} = props.items
    Books.map((book) => {
    setType(book.type)
    setId(book.id);
    setAuthorid(book.author_id)
    setSubCategory(book.parent_id)
    setName(book.book_name)
    setLang(book.lang);
    console.log(book.parent_id);
    setCategory(book.Category_id);
    setSubCategory(book.parent_id)
    props.ViewSubcategories(book.Category_id)
    if(book.tags){
      setTags(book.tags)
    }  
  })
}, [props.items.Books])

 const EditPoster = () =>{
  const link = "/admin/ViewBook/"+type +"/" + id + "/edit/" + name + "/poster";
  props.history.push(link)
 }


  const onSubmit = (item) => {
    item.type="Book";
    setVisibility(true)
    console.log(item)
    setLoader(
      <CircularProgress visibility="hidden"  color="secondary" />
    )
    item.subcategory_id = subcategory;
    item.id = id;
    item.type = type;
    item.language = language;
    item.cat_id = category;
    //add subcategory name
    console.log(props.subcategories.Subcategories)
    if(props.subcategories.Subcategories){
      item.subcategory = props.subcategories.Subcategories.find(o => o.id === subcategory).category_name
    }  
    props.EditBook(item , props.history); 
  };

useEffect( () => {
  setVisibility(false)
    setLoader(null)
  setError(props.errors)
}, [props.errors])


useEffect( () => {
  setSubCategories(props.subcategories.Subcategories);
  console.log(props.subcategories)
}, [props.subcategories.Subcategories])


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
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h2 className={classes.cardTitleWhite}>Edit Book</h2>
                <h3 className={classes.cardCategoryWhite}>Edit Book Details</h3>
              </CardHeader>
              {books.map((book) => 
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-simple-select-label">
                       Sub Category
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"   
                        value = {subcategory}                 
                        onChange={handleChange}
                        displayEmpty = {false}
                      >
                          
                    {subcategories && subcategories.map((category) => 
                      <MenuItem value={category.id}>{category.category_name}</MenuItem>
                    )}
                      </Select>
                    </FormControl>
                    <CustomInput
                      labelText="Name of the Book"
                      id="book_name"
                      name="name"
                      value={book.book_name}
                      control={control}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                    <CustomInput
                      labelText="Name of the Author"
                      id="Author_name"
                      name="author"
                      value={book.author}
                      control={control}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
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
                <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                      labelText="Tags(provide comma seperated tags)"
                      id="tags"
                      name="tags"
                      required = {false}
                      value= {tags.join(",")}
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
                      value={book.description}
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
              </CardBody>
               )}
              <CardFooter>
                <Button disabled={disable}  type="submit" color="rose">
                  Update
                </Button>
                {loader}
                {error.message && (
                     <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                     {error.message}
                    </Typography>
                  )} 
                <Button onClick={EditPoster} color="rose">
                  Edit Poster
                </Button>
                
              </CardFooter>
            </Card>
          </GridItem>
         </GridContainer>
      </form>
    </div>
  );
}
Editbook.propTypes ={
 
  auth: propTypes.object.isRequired,
  GetSubCategories: propTypes.func.isRequired,
  ViewBookPage :propTypes.func.isRequired,
  EditBook: propTypes.func.isRequired,
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  poster : state.poster,
  items : state.items,
  categories: state.categories,
  subcategories: state.subcategories
});

export default connect(mapStateToProps, {EditBook , GetSubCategories, ViewBookPage , ViewSubcategories , GetCategories})(Editbook);