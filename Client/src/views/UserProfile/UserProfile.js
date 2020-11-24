import React, { useState, useEffect } from "react";
// @material-ui/core components
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
import { useForm, ErrorMessage, Controller } from "react-hook-form";
import { connect } from "react-redux";
import { registerUser , changePassword} from "../../actions/authAction"
import { clearMybooks , clearCategories , clearSubcategories , clearSubbooks} from "../../actions/Books.js"

import propTypes from "prop-types";
import { Typography } from '@material-ui/core';
const styles = {
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
  },

  form : {
    
  }
};

const useStyles = makeStyles(styles);


const UserAccount = (props) => {

  const [error , setError] = React.useState("")

  const { handleSubmit, errors, control } = useForm();

  const { handleSubmit: handleSubmit2, errors : errors2, control: control2 } = useForm({
    mode: "onBlur"
  });
  useEffect( () => {
    if(!props.auth.isAdmin){
      props.history.push("/admin/Dashboard")
    }
  //Clear states of paginations
 props.clearCategories();
 props.clearMybooks();
 props.clearSubbooks();
 props.clearSubcategories();
  } ,[props.auth])
  
  useEffect( () => {
    setError(props.errors)
}, [props.errors])

  const onChangePasswordSubmit = item =>{
    props.changePassword(item , props.history);
    
  }
  const onSubmit = item => {
    //Send login request
    props.registerUser(item , props.history);

  };
 
  const classes = useStyles();
  return (
    <div>

      <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
      <form key={1} className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Card> 
            <CardHeader color="primary">
            <h2 className={classes.cardTitleWhite}>Add User</h2>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Username"
                    name="username"
                    control={control}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Email address"
                    id="email-address"
                    name="email"
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
                    id="password"
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
              <Button type="submit" color="primary">ADD</Button>
              {error.message && (
                     <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                     {error.message}
                    </Typography>
                  )} 
             
            </CardFooter>
          </Card>
        </form>
        </GridItem>       
        <GridItem xs={12} sm={12} md={6}>
        <form key={2} className={classes.form} onSubmit={handleSubmit2(onChangePasswordSubmit)}>
          <Card>
            <CardHeader color="primary">
              <h2 className={classes.cardTitleWhite}>Change Password</h2>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Username"
                    id="username"
                    name="username"
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
                    labelText="Old Password"
                    id="password"
                    name="oldpassword"
                    control={control2}
                    type="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="New Password"
                    name="newpassword"
                    control={control2}
                    type="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button type="submit" color="primary">Update</Button>
              {error.changepassword && (
                     <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                     {error.changepassword}
                    </Typography>
                  )} 
            </CardFooter>
          </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
UserAccount.propTypes ={
  registerUser: propTypes.func.isRequired,
  changePassword: propTypes.func.isRequired,
  auth: propTypes.object.isRequired
};

const mapStateToProps =(state) =>({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {registerUser , changePassword ,  clearMybooks , clearCategories , clearSubcategories , clearSubbooks})(UserAccount);