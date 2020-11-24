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
import {GetAllCategories , EditSubCategory} from "../../actions/Books.js"
import {  ViewSubCategory} from "../../actions/Books.js"
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
  const [category, setCategory] = React.useState([]);
  const [subcategories, setSubCategories] = React.useState([]);
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
  const [parent , setParent] = React.useState();
  const [ loader , setLoader] = React.useState(null);
  const [disable, setVisibility] = React.useState(false);
 useEffect( () => {
  props.ViewSubCategory(props.match.params.subid, "Sub Category")
  props.GetAllCategories()
} ,[props.auth])

  const handleChange = event => {
    setParent(event.target.value);
  };
  
 useEffect( () => {
    setSubCategories(props.items.Subcategory);
    setBookLoading(false);
    const {Subcategory} = props.items
    Subcategory.map((sub) => {
    setId(sub.id);
    setParent(sub.parent_id);
    setName(sub.category_name);
  })
}, [props.items.Subcategory])


 const EditPoster = () =>{
  const link = "/admin/edit/SubCategory/" + id + "/" + name + "/poster";
  props.history.push(link)
 }


  const onSubmit = (item) => {
    setVisibility(true)
    setLoader(
      <CircularProgress visibility="hidden"  color="secondary" />
    )
    item.type="Sub Category";
    item.parent = parent;
    item.id = id;
    console.log(item)
    props.EditSubCategory(item , props.history);
    
  };

useEffect( () => {
  setVisibility(false)
    setLoader(null)
  setError(props.errors)
}, [props.errors])


useEffect( () => {
  setCategory(props.items.Categories)
}, [props.items.Categories])


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h2 className={classes.cardTitleWhite}>Edit SubCategory</h2>
                <h3 className={classes.cardCategoryWhite}>Edit  Details</h3>
              </CardHeader>
              {subcategories.map((sub) => 
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
                      
                        onChange={handleChange}
                        displayEmpty = {false}
                      >
                          
                    {category.map((category) => 
                      <MenuItem value={category.id}>{category.category_name}</MenuItem>
                    )}
                      </Select>
                    </FormControl>
                    <CustomInput
                      labelText="Name of the Book"
                      id="book_name"
                      name="name"
                      value={sub.category_name}
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
                      labelText="Subtitle"
                      id="subtitle"
                      name="subtitle"
                      value={sub.subtitle}
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
                      value={sub.category_Desc}
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
                <Button disabled={disable} type="submit" color="rose">
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
  GetAllCategories: propTypes.func.isRequired, 
  EditSubCategory: propTypes.func.isRequired,
  ViewSubCategory: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  poster : state.poster,
  items : state.items
});

export default connect(mapStateToProps, {EditSubCategory ,GetAllCategories , ViewSubCategory})(Editbook);