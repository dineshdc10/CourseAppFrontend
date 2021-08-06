import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withRouter } from "react-router-dom";
import { saveState } from "../../localStorage";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import SnackBar from "../common/snackBar";
import Config from '../../config';

const styles = theme => ({
    card: {
        marginTop: "100px"
    },
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
});

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            password: "",
            classes: props.classes,
            errors: {
                userId: "",
                password: ""
            },
            message: ""
        };
    }

    setSnack = message => {
        this.setState({ message });
    };

    //Maintain state with change in input
    handleChange = event => {
        var errors = Object.assign(this.state.errors);
        var val = event.target.value;
        val = event.target.value.trim();

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

    handleRes = res => {
        if (res.ok) {
            return res.json();
        } else {
            this.setSnack("Sorry,we are unable to serve you now!!")
        }
    };

    trimForm = () => {
        var user = Object.assign(this.state);
        user.userId = user.userId.trim();
        user.password = user.password.trim();
        return user;
    };

    validateForm = () => {
        var user = this.trimForm();
        var errors = this.state.errors;
        var isValid = true;
        var val_Pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (
            user.userId === "" ||
            user.userId.length < 4 || user.userId.length > 500 ||
            !this.validateEmail(user.userId)
        ) {
            isValid = false;
        }
        if (user.password === "" || !user.password.match(val_Pass)) {
            isValid = false;
        }
        this.setState({
            errors
        });
        return isValid;
    };

    //Submit the userName and Password
    handleSubmit = event => {
        event.preventDefault();
        if (this.validateForm()) {
            var dataaa = { userId: this.state.userId, password: this.state.password };
            fetch(Config.url + "/user/login", {
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
                    if (data) {
                        if (data.isAuth) {
                            saveState({
                                isAuth: true,
                                userId: data.userid,
                                fisrtName: data.firstname,
                                lastName: data.lastname
                            });
                            this.props.history.push("/courses");
                            this.props.setAuth(true, data.userid);
                        } else {
                            this.setSnack("Invalid ID or Password!!");
                        }
                    }
                }).catch((err) => {
                    this.setSnack("Sorry,we are unable to serve you now!!")
                });
        } else {
            this.setSnack("Invalid ID or Password!!");
        }
    };

    validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    render() {
        const classes = this.state.classes;
        return (
            <div>
                <SnackBar
                    message={this.state.message}
                    closeSnackBar={() => this.setState({ message: "" })}
                />
                <Container component="main" maxWidth="xs" className={classes.card}>
                    <Card>
                        <CardContent>
                            <div className={classes.paper}>
                                <Avatar className={classes.avatar}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Sign In
                                </Typography>
                                <form
                                    className={classes.form}
                                    onSubmit={event => this.handleSubmit(event)}
                                >
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="userId"
                                        label="User ID"
                                        name="userId"
                                        type="text"
                                        autoComplete="userId"
                                        value={this.state.userId}
                                        onChange={this.handleChange}
                                        autoFocus
                                        error={this.state.errors.userId.length > 0}
                                        helperText={this.state.errors.userId}
                                        inputProps={{ maxLength: 500, minLength: 4 }}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        onChange={this.handleChange}
                                        value={this.state.password}
                                        error={this.state.errors.password.length > 0}
                                        helperText={this.state.errors.password}
                                        inputProps={{ maxLength: 15 }}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                    >
                                        Sign In
                                    </Button>
                                    <Grid container>
                                        <Grid item>
                                            <Link href="/signup" variant="body2">
                                                {"Don't have an account? Sign Up"}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </Container>
            </div>
        );
    }


}

export default withRouter(withStyles(styles)(Login));
