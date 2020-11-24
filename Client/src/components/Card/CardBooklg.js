import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";


const useStyles = makeStyles({
  root: {
    maxWidth: 445,
    maxHeight: 2045,
  },
  media: {
    height: 440
  }
});

export default function CardBook(props) {
  const classes = useStyles();
  const { image, title, description, link, ...rest } = props;
  return (
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
  );
}
CardBook.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string
};
