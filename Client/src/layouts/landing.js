import React, { useState, useEffect } from "react";
// @material-ui/core components
import { Container } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/test.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
//Redux
import { connect } from "react-redux";
import {loginUser} from "../actions/authAction"
import propTypes from "prop-types";
//React Hook Form
import { useForm, ErrorMessage, Controller } from "react-hook-form";
//Bring Axios
import axios from 'axios';


const styles = {
  root:{
    padding: "40px"
  },
  header:{
    textAlign: "center",
    color: "rgba(255,255,255,.62)"
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
};

const useStyles = makeStyles(styles);


const LandingPage =  (props) => {
  const [ loader , setLoader] = React.useState(null)
  const [disable, setVisibility] = React.useState(true);


    const [error , setError] = React.useState("")

    const { handleSubmit, errors, control } = useForm();
    const onSubmit = item => {
      setVisibility(true)
      setLoader(
        <CircularProgress visibility="hidden"  color="secondary" />
      )
      console.log(item);
      props.loginUser(item , props.history);
     
    };
    useEffect( () => {
      setError(props.errors);
      setVisibility(false)
      setLoader(null)
  }, [props.errors])
  
  
  const classes = useStyles();
  return (
    <Container>
     <Typography classname={classes.header} variant="h1" component="h2" align="center" color="textSecondary" gutterBottom>
        Welcome to Book CMS
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="rose">
              <h2 className={classes.cardTitleWhite}>Login</h2>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Username"
                    id="username"
                    name="username"
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
                    labelText="Password"
                    name="password"
                    type="password"             
                     control={control}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button disabled={disable} type="submit" color="rose">Login</Button>
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
    </Container>
  );
}

LandingPage.propTypes ={
  registerUser: propTypes.func.isRequired,
  auth: propTypes.object.isRequired,
  loginUser: propTypes.func.isRequired
};
const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {loginUser})(LandingPage);