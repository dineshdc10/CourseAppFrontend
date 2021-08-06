import React, { createRef } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { removeState } from "../../localStorage";
import SnackBar from "../common/snackBar";
import { withRouter } from "react-router-dom";
import Config from '../../config';

const styles = () => ({
    header: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        backgroundColor: "#0b1e28",
        color: "white",
        marginBottom: 20,
        marginLeft: 10,
        borderRadius: 5
    },
    container : {
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        paddingTop: '56.25%'
    },
    responsiveIframe : {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%'
    },
    thumbnailContainer: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    thumbnail: {
        backgroundColor: 'transparent',
        pointerEvents: 'none'
    },
    thumbnailSelected: {
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        border: '2px solid red'
    }
});

class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course: null,
            playvideo : 0,
            classes: props.classes,
            message: "",
        };
        this.iframeRef = React.createRef()
    }

    componentDidMount() {
        this.verifyPaidCourse();
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

    verifyPaidCourse = () => {
        let courseid = this.props.location.search;
        if (courseid) {
            courseid = courseid.replace("?id=", "");
            courseid = parseInt(courseid.toString());
        }
        if (courseid) {
            let dataaa = { courseid: courseid };
            fetch(Config.url + "/courses/verifypaidcourse", {
                method: "POST",
                body: JSON.stringify(dataaa),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    return this.handleRes(res);
                })
                .then(data => {
                    if (data && data.success) {
                        this.getCourseDetails(courseid);
                    }
                    else {
                        this.props.history.push("/courses");
                    }
                })
                .catch((err) => {
                    this.setSnack("Sorry,we are unable to serve you now!!")
                });
        }
        else {
            this.props.history.push("/error/unAuthorized");
        }
        
    }

    getCourseDetails = (courseid) => {
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
                    let course = null;
                    for (let i = 0; i < data.length; i++){
                        if (data[i].id == courseid) {
                            course = data[i];
                            break;
                        }
                    }
                    this.setState({
                        course,
                        playvideo: 0
                    })
                }
                else {
                    this.setSnack("Sorry,we are unable to serve you now!!")
                }
            });

    };


    setSnack = message => {
        this.setState({ message });
    };

    getvideourl = (url) => {
        return url.replace("https://youtu.be/", "https://www.youtube.com/embed/");
    }

    playCourseVideo = (event, id) => {
        event.stopPropagation();
        this.setState({
            playvideo: id
        })
        this.iframeRef.current.scrollIntoView()
    }

    render() {
        const classes = this.props.classes;
        const course = this.state.course ? this.state.course : { videoLink: [], title: "" };
        const videos = course.videoLink;
        return (
            <React.Fragment>
                <SnackBar
                    message={this.state.message}
                    closeSnackBar={() => this.setState({ message: "" })}
                />
                
                <Grid container spacing={3} style={{ marginTop: 20 }}>
                    <Grid item xs={12} sm={12} md={8} lg={9} className={classes.header}>
                        <Grid container spacing={3} >
                            <Grid item xs={12} sm={12} md={12} className={classes.title}>
                                <Typography variant="h6" ref={this.iframeRef}>
                                    {course.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                {videos.length > this.state.playvideo &&
                                    <div className={classes.container}>
                                    <iframe className={classes.responsiveIframe} src={this.getvideourl(videos[this.state.playvideo])} title={course.title}></iframe>
                                    </div>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={3} className={classes.header}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} className={classes.title}>
                                <Typography variant="h6">
                                   Course videos
                                </Typography>
                            </Grid>
                            {videos.map((video,id) => {
                                video = this.getvideourl(video);
                                return (
                                    <Grid className={classes.thumbnailContainer}
                                        onClick={(event) => this.playCourseVideo(event, id)} key={id} item xs={12} sm={6} md={12} lg={12}>
                                        <div className={this.state.playvideo == id?classes.thumbnailSelected : classes.thumbnail}>
                                            <iframe src={video} title={course.title}></iframe>
                                        </div>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={1} style={{ marginTop: 20 }}></Grid>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Course));
