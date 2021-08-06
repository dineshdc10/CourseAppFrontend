import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withRouter } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import { removeState } from "../localStorage";

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    user: { flexGrow: 1, },
    title: {
        flexGrow: 1,
        cursor: 'pointer'
    },
});

class Header extends React.Component {

    logout = () => {
        removeState();
        fetch("/user/logout")
            .then(res => {
                if (res.ok) {
                    this.props.history.push("/");
                    this.props.setAuth(false, "");
                }
            })
            .catch(error => {
                this.props.setSnack(error);
            });
    };

    login = () => {
        this.props.history.push("/");
    }

    home = () => {
        this.props.history.push("/courses");
    }


    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.root}>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title} >
                            <div onClick={this.home}>
                                DC
                            </div>
                        </Typography>
                        {this.props.isAuth === true &&
                            <Typography>
                                Hello, {this.props.userId}!
                            </Typography>}
                        {this.props.isAuth === true ?
                            <Button variant="outlined" color="inherit" style={{marginLeft : 20}} onClick={this.logout}>Logout</Button>
                            :
                            <Button variant="outlined" color="inherit" style={{ marginLeft: 20 }} onClick={this.login}>Login</Button>
                        }
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles)(Header));