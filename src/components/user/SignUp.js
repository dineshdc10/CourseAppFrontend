import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import AccountCircleIcon from "@material-ui/icons/AccountCircleOutlined";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { removeState } from "../../localStorage";
import { withRouter } from "react-router-dom";
import Container from "@material-ui/core/Container";
import SnackBar from "../common/snackBar";
import Config from '../../config';

const styles = () => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    card: {
        marginTop: "20px"
    },
    form: {
        display: "flex",
        flexWrap: "wrap"
    },

    avatar: {
        margin: 10
    }
});

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: props.classes,
            password: "",
            userId: "",
            repassword: "",
            errors: {
                userId: "",
                password: "",
                repassword: ""
            },
            message: ""
        };
    }

    setSnack = message => {
        this.setState({ message });
    };

    validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    //Maintain state with change in input
    handleChange = event => {
        var errors = Object.assign(this.state.errors);
        var val = event.target.value;
        if (event.target.type === "text" && event.target.id === "userId") {
            val = event.target.value.trim();
        } else if (event.target.type === "text") {
            val = event.target.value
                .toUpperCase()
                .replace(/[^a-zA-Z ]+/g, "");
        } else if (event.target.type === "password") {
            val = event.target.value.trim().replace(/[^A-Za-z0-9_@#&]+/g, "");
        }
        if (val === "") {
            errors[[event.target.name]] = "Field is required!!";
        } else {
            errors[[event.target.name]] = "";
        }

        this.setState({
            [event.target.name]: val,
            errors
        });
    };

    handleReset = () => {
        this.setState({
            password: "",
            userId: "",
            repassword: "",
            errors: {
                userId: "",
                password: "",
                repassword: ""
            }
        });
    };

    handleRes = res => {
        if (res.ok) {
            return res.json();
        } else {
            if (res.status === 401) {
                removeState();
                this.props.history.push("/error/loginRequired");
            } else if (res.status === 403) {
                this.props.history.push("/error/unAuthorized");
            } else {
                this.setSnack("Sorry,we are unable to serve you now!!")
            }
        }
    };

    trimForm = () => {
        var user = Object.assign(this.state, {});
        user.userId = user.userId.trim();
        user.password = user.password.trim();
        user.repassword = user.repassword.trim();
        return user;
    };

    validateForm = () => {
        var user = this.trimForm();
        var errors = Object.assign(this.state.errors, {});
        var isValid = true;
        var val_Pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (
            user.userId === "" ||
            user.userId.length < 4 || user.userId.length > 500 ||
            !this.validateEmail(user.userId)
        ) {
            errors.userId = "Please enter a valid email ID!!";
            isValid = false;
        }
        if (user.password === "" || !user.password.match(val_Pass)) {
            errors.password =
                "Password must be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character(_ @ # &)";
            isValid = false;
        }
        if (user.password !== user.repassword) {
            errors.repassword = "Password and Re-Enter Password are different!!";
            isValid = false;
        }
        this.setState({
            errors
        });
        return isValid;
    };

    handleSubmit = event => {
        event.preventDefault();
        //this.validateForm()
        if (this.validateForm()) {
            var bodydata = {
                userId: this.state.userId,
                password: this.state.password
            }
            fetch(Config.url + "/user/register", {
                method: "POST",
                body: JSON.stringify(bodydata),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            })
                .then(res => {
                    return this.handleRes(res);
                })
                .then(data => {
                    if (data && data.success) {
                        this.setSnack(data.message);
                        this.props.history.push("/");
                    } else {
                        this.setSnack(data.message);
                        this.setState({
                            errors: data.errors
                        });
                    }
                }).catch((err) => {
                    this.setSnack("Sorry,we are unable to serve you now!!")
                });
        } else {
            this.setSnack("Please fill in all the Data!!");
        }
    };

    render() {
        const classes = this.state.classes;
        return (
            <React.Fragment>
                <SnackBar
                    message={this.state.message}
                    closeSnackBar={() => this.setState({ message: "" })}
                />
                <Container component="main" maxWidth="sm" style={{ marginTop: 100 }}>
                    <Card className={classes.card}>
                        <CardContent
                            style={{
                                paddingBottom: "0px",
                                paddingTop: "0px",
                                paddingLeft: "0px"
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={3} style={{ backgroundColor: "#4cadd4" }}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12}>
                                            <Fab
                                                className={classes.avatar}
                                                style={{ left: "25%", top: "30px" }}
                                                disableFocusRipple
                                                disableRipple
                                            >
                                                <AccountCircleIcon />
                                            </Fab>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h6"
                                                style={{ textAlign: "center", marginLeft: "10px" }}
                                            >
                                                SignUp
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={9} style={{ paddingTop: "30px" }}>
                                    <form
                                        className={classes.form}
                                        onSubmit={event => this.handleSubmit(event)}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    autoFocus
                                                    variant="outlined"
                                                    margin="dense"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    id="userId"
                                                    label="Email ID"
                                                    name="userId"
                                                    autoComplete="userId"
                                                    value={this.state.userId}
                                                    onChange={event => this.handleChange(event)}
                                                    error={this.state.errors.userId.length > 0}
                                                    helperText={this.state.errors.userId}
                                                    inputProps={{ maxLength: 500, minLength: 4 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6} />
                                            <Grid item xs={12} md={8}>
                                                <TextField
                                                    variant="outlined"
                                                    margin="dense"
                                                    required
                                                    fullWidth
                                                    name="password"
                                                    label="Password"
                                                    type="password"
                                                    id="password"
                                                    onChange={event => this.handleChange(event)}
                                                    error={this.state.errors.password.length > 0}
                                                    helperText={this.state.errors.password}
                                                    value={this.state.password}
                                                    autoComplete="password"
                                                    inputProps={{ maxLength: 15, minLength: 8 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <TextField
                                                    variant="outlined"
                                                    margin="dense"
                                                    required
                                                    fullWidth
                                                    name="repassword"
                                                    label="Re-Enter Password"
                                                    type="password"
                                                    id="re-password"
                                                    onChange={event => this.handleChange(event)}
                                                    error={this.state.errors.repassword.length > 0}
                                                    helperText={this.state.errors.repassword}
                                                    value={this.state.repassword}
                                                    autoComplete="repassword"
                                                    inputProps={{ maxLength: 15, minLength: 8 }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={2} style={{ marginTop: 20 }}>
                                            <Grid item xs>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => this.handleReset()}
                                                    style={{ marginBottom: "20px" }}
                                                >
                                                    Reset
                                                </Button>
                                            </Grid>
                                            <Grid item xs>
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ marginBottom: "20px" }}
                                                >
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Container>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(SignUp));
