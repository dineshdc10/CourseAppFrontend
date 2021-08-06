import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { removeState } from "../../localStorage";
import SnackBar from "../common/snackBar";
import { withRouter } from "react-router-dom";
import Config from '../../config';
import CourseCard from './CourseCard';

const styles = () => ({
    card: { display: 'flex', alignItems: 'center', justifyContent: 'left' },
    title: {
        display: 'flex', alignItems: 'center', justifyContent: 'left',
        backgroundColor: "#0b1e28", color: "white", marginBottom: 20,
        borderRadius : 5
    }
});

class CourseList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unpaidCourseList: [],
            paidCourseList: [],
            classes: props.classes,
            message: "",
        };
    }

    componentDidMount() {
        this.getCourseList();
    }

    handleRes = res => {
        if (res.ok) {
            return res.json();
        } else {
            if (res.status === 401) {
                removeState();
                this.props.history.push("/");
            } else if (res.status === 403) {
                this.props.history.push("/error/unAuthorized");
            } else {
                this.setSnack("Sorry,we are unable to serve you now!!")
            }
        }
    };

    getPaidCourseList = (courselist) => {
        console.log(Config.url);
        fetch(Config.url + "/courses/getcourselist", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return this.handleRes(res);
            })
            .then(data => {
                if (data && data.courselist) {
                    let piadCourses = data.courselist;
                    var paidCourseList = [];
                    var unpaidCourseList = [];
                    for (let i = 0; i < courselist.length; i++) {
                        let isPaid = false;
                        for (let j = 0; j < piadCourses.length; j++) {
                            if (piadCourses[j].courseid == courselist[i].id) {
                                isPaid = true;
                            }
                        }
                        let course = courselist[i];
                        course.isPaid = isPaid;
                        if (isPaid) {
                            paidCourseList.push(course);
                        }
                        else {
                            unpaidCourseList.push(course);
                        }
                    }
                    this.setState({
                        paidCourseList,
                        unpaidCourseList
                    })
                }
                else {
                    this.setSnack("Failed to get courses!!");
                }
            })
            .catch((err) => {
                this.setSnack("Sorry,we are unable to serve you now!!")
            });
    }

    getCourseList = () => {
        fetch(Config.listurl, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                return this.handleRes(res);
            }).then(data => {
                if (data) {
                    this.getPaidCourseList(data);
                }
                else {
                    this.setSnack("Sorry,we are unable to serve you now!!")
                }
            });

    };


    setSnack = message => {
        this.setState({ message });
    };

    render() {
        const classes = this.props.classes;
        return (
            <React.Fragment>
                <SnackBar
                    message={this.state.message}
                    closeSnackBar={() => this.setState({ message: "" })}
                />
                {this.state.paidCourseList && this.state.paidCourseList.length > 0 ?
                    <Grid container spacing={3} style={{ marginTop: 20 }}>
                        <Grid item xs={12} sm={12} md={12} className={classes.title}>
                            <Typography variant="h6">
                                Bought Courses
                            </Typography>
                        </Grid>
                        {this.state.paidCourseList.map(course => {
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} className={classes.card}>
                                    < CourseCard course={course} />
                                </Grid>
                            )
                        })}
                    </Grid>
                    : ""}
                <Grid container spacing={3} style={{ marginTop: 20 }}>
                    <Grid item xs={12} sm={12} md={12} className={classes.title}>
                        <Typography variant="h6">
                            Courses
                        </Typography>
                    </Grid>
                    {this.state.unpaidCourseList.map(course => {
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} className={classes.card}>
                                < CourseCard course={course} />
                            </Grid>
                        )
                    })}
                </Grid>
                <Grid container spacing={1} style={{ marginTop: 20 }}></Grid>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(CourseList));
