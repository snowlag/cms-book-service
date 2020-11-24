import React from "react";
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
    flexGrow: 1,
    height: 350
  },
  media: {
    height: 180
  }
});

export default function CategoryCard(props) {
  const classes = useStyles();
  const { image, title, description, ViewLink, EditLink,category_id, ...rest } = props;
  const link = category_id + "/edit"
  return (
    <Card className={classes.root}>
      <NavLink style={{ textDecoration: "none" }} to={ViewLink+category_id}>
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
      </NavLink>
      <CardActions>
        <NavLink style={{ textDecoration: "none" }} to={EditLink + link}>
          <Button size="small" color="primary">
            Edit
          </Button>
        </NavLink>
      </CardActions>
    </Card>
  );
}
CategoryCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  ViewLink: PropTypes.string,
  category_id: PropTypes.string
};
