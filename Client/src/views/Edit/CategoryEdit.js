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
import { EditCategory} from "../../actions/Books.js"
import {ViewCategory} from "../../actions/Books.js"
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


const Editcategory= (props)=> {

  const { handleSubmit, errors, control } = useForm();

  const classes = useStyles();
  const [error , setError] = React.useState("")
  const [category, setCategory] = React.useState([]);
  const [name ,setName] = React.useState(""); 
  const [ loading , setLoading] = React.useState(true);
  const [id , setId] = React.useState("")
  const [ loader , setLoader] = React.useState(null);
  const [disable, setVisibility] = React.useState(false);
 useEffect( () => {
  props.ViewCategory(props.match.params.cat_id, "Category")
} ,[props.auth])
  
 useEffect( () => {
    setCategory(props.items.Category);
    setLoading(false);
    const {Category} = props.items
    Category.map((category) => {
    setName(category.category_name)
    setId(category.id)
  })
}, [props.items.Category])


  const onSubmit = (item) => {
    setVisibility(true)
    setLoader(
      <CircularProgress visibility="hidden"  color="secondary" />
    )
    item.id =props.match.params.cat_id ;
    props.EditCategory(item , props.history);
    
  };

useEffect( () => {
  setError(props.errors);
  setVisibility(false)
    setLoader(null)
}, [props.errors])

const EditPoster = (event) =>{
  const link = "/admin/edit/" + id + "/" + name +"/poster"
  props.history.push(link)
}


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h2 className={classes.cardTitleWhite}>Edit Category</h2>
                <h3 className={classes.cardCategoryWhite}>Edit Book Details</h3>
              </CardHeader>
              {category.map((category) => 
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Name of the Category"
                       name="name"
                      value={category.category_name}
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
                       name="subtitle"
                      value={category.subtitle}
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
                      labelText="Description of the Category"
                      id="Description"
                      name="desc"
                      value={category.category_Desc}
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
Editcategory.propTypes ={
 
  auth: propTypes.object.isRequired,
  GetSubCategories: propTypes.func.isRequired,
  ViewCategory :propTypes.func.isRequired,
  EditCategory: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors,
  poster : state.poster,
  items : state.items
});

export default connect(mapStateToProps, { EditCategory, ViewCategory})(Editcategory);