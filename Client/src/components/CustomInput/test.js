import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
// @material-ui/icons
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
// core components
import styles from "assets/jss/material-dashboard-react/components/customInputStyle.js";
import { useForm, ErrorMessage, Controller } from "react-hook-form";
const useStyles = makeStyles(styles);

export default function CustomInput(props) {
  const classes = useStyles();
  var {
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    success,
    value,
    type,
    name,
    control,
    onChange,
    disabled , 
    required
  } = props;

  const labelClasses = classNames({
    [" " + classes.labelRootError]: error,
    [" " + classes.labelRootSuccess]: success && !error
  });
  const underlineClasses = classNames({
    [classes.underlineError]: error,
    [classes.underlineSuccess]: success && !error,
    [classes.underline]: true
  });
  const marginTop = classNames({
    [classes.marginTop]: labelText === undefined
  });
  if(typeof(required) === "undefined"){
    required = true;
  }
  return (
    <FormControl
      {...formControlProps}
      className={formControlProps.className + " " + classes.formControl}
    >
      {labelText !== undefined ? (
        <InputLabel
          className={classes.labelRoot + labelClasses}
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </InputLabel>
      ) : null}
     <Controller 
     as = {
      <Input
      classes={{
        root: marginTop,
        disabled: classes.disabled,
        underline: underlineClasses
      }}
      id={id}
      type={type}
      disable
      onChange={onChange}
      {...inputProps}
    />
     }
     name={name}
     rules={{ required: required }}
     onChange={onChange}
     control={control}
     defaultValue={value}
     />

      {error ? (
        <Clear className={classes.feedback + " " + classes.labelRootError} />
      ) : success ? (
        <Check className={classes.feedback + " " + classes.labelRootSuccess} />
      ) : null}
    </FormControl>
  );
}

CustomInput.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
  value: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func
};
CustomInput.defaultProps = {
  type: "text",
};