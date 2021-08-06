import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withRouter } from "react-router-dom";
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
    root: {
        minWidth: '100%'
    },
    media: {
        height: 200,
        backgroundSize: "contain"
    },
    buttons: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: 'center'
    },
    title: {
         backgroundColor: '#F0F0F0' 
    }
});

function CourseCard(props) {
    const classes = useStyles();
    const course = props.course;

    const onBuyClick = () => {
        props.history.push("/payment/" + course.id);
    }

    const onStartClick = () => {
        props.history.push("/course/courses?id=" + course.id);
    }

    return (
        <Card className={classes.root}>
            <CardHeader
                className={classes.title}
                title={<Typography variant="h6" component="p">
                    {course.title}
                </Typography>}
            />
            <Divider />
            <CardMedia
                className={classes.media}
                image={course.thumbnailURL}
                title={course.title}
            />
            <CardActions className={classes.buttons}>
                <Typography gutterBottom variant="h6" component="p">
                    ₹ {course.price}
                </Typography>
                {course.isPaid ?
                    <Button variant="outlined" size="small" color="primary" onClick={onStartClick}>
                        Start Course
                    </Button>:
                    <Button variant="outlined" size="small" color="primary" onClick={onBuyClick}>
                        Buy Now
                    </Button> 
                }
            </CardActions>
        </Card>
    );
}

export default withRouter(CourseCard);
