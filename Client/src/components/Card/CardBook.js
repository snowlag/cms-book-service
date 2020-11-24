import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";


const useStyles = makeStyles({
  root: {
    maxWidth: 545,
    marginBottom: 40,
    minHeight: 280
  },
  media: {
    height: 215
  }
});

export default function CardBook(props) {
  const classes = useStyles();
  const { image, title, description, id, ...rest } = props;
  const [link , setLink] = React.useState("/admin/ViewBook/")
 
useEffect( () => {
  setLink("/admin/ViewBook/Book/" + props.id)
}, [props.id])

  return (
    <NavLink
      style={{ textDecoration: "none" }}
      to= {link}
    >
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia className={classes.media} image={image} title={title} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </NavLink>
  );
}
CardBook.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string
};
