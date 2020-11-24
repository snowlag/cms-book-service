import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import PropTypes from "prop-types";
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

export default function CardFile(props) {
  const classes = useStyles();
  const { header, cardDesc, labelItem, labelUrl, ...rest } = props;

  return (
    <Card>
      <CardHeader color="primary">
        <h2 className={classes.cardTitleWhite}>{header}</h2>
        <h3 className={classes.cardCategoryWhite}>{cardDesc}</h3>
      </CardHeader>
      <CardBody>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              id="file"
              type="file"
              formControlProps={{
                fullWidth: true
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomInput
              labelText={labelUrl}
              id="url"
              formControlProps={{
                fullWidth: true
              }}
            />
          </GridItem>
        </GridContainer>
      </CardBody>
      <CardFooter>
        <Button color="primary">Upload</Button>
      </CardFooter>
    </Card>
  );
}

CardFile.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string
};
