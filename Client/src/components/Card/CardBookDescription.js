import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import Edit from "@material-ui/icons/Edit";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Download from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import { NavLink } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    minWidth: 475
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

export default function CardBookDescription(props) {
  const classes = useStyles();
  const { Title, Description, Author, id ,book_name ,type , tags ,lang ,...rest } = props;
  const link = "/admin/ViewBook/"+ type + "/" + id + "/edit";
  let booktags = ["No Tag for these book"]
  if(tags){
    booktags = tags
  }
 let language = "No Language specified"
  if(lang){
    language = lang
  }

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          <NavLink style={{textDecoration: 'none'}} to={link}><Edit /></NavLink><br />
          {Title}
        </Typography>
        <Typography variant="h5" component="h2">
          {Description}
          <br />
          <br />
        </Typography>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
              <Typography className={classes.pos} color="textSecondary">
              Author
            </Typography>
            <Typography variant="h5" component="h2">
              {Author}
            </Typography>
          </GridItem>

          <GridItem xs={12} sm={12} md={4}>
            <Typography className={classes.pos} color="textSecondary">
                   Language
            </Typography>
            <Typography variant="h5" component="h2">
                 {language}
            </Typography>
          </GridItem>

          <GridItem xs={12} sm={12} md={4}>
               <Typography className={classes.pos} color="textSecondary">
                Tags
              </Typography>
              <Typography variant="h5" component="h2">
                {booktags.map(tag => 
                    <li>{tag}</li>
                  )}
              </Typography>
            </GridItem> 
        </GridContainer>
      </CardContent>
    </Card>
  );
}
CardBookDescription.propTypes = {
  Title: PropTypes.string,
  Description: PropTypes.string,
  Author: PropTypes.string,
  id: PropTypes.string,
  book_name : PropTypes.string
};
