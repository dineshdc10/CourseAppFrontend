import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./components/user/Login";
import SignUp from "./components/user/SignUp";
import Header from './components/Header';
import Payment from './components/payment/Payment';

import UnAuthorized from "./components/error/unAuthorized";
import LoginRequired from "./components/error/loginRequired";
import PageNotFound from "./components/error/pageNotFound";
import CourseList from "./components/courses/CourseList";
import Course from "./components/courses/Course";
import { Container } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import SnackBar from "./components/common/snackBar";
import { loadState } from "./localStorage";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from '@material-ui/core/Toolbar';

import { createTheme } from "@material-ui/core/styles";

const theme1 = createTheme({
  palette: {
    primary: {
      main: "#4A9DCA"
    },
    secondary: {
      main: "#FE4A49"
    }
  },
  typography: {
    // Tell Material-UI what's the font-size on the html element is.
  }
});

const styles = theme1 => ({
  "@global": {
    body: {
      backgroundColor: theme1.palette.common.white,
      backgroundImage: `url(${Image})`,
      backgroundRepeat: "repeat",
      backgroundSize: "100% 1000px"
    },
    html: {
      fontSize: 13,
      [theme1.breakpoints.up("sm")]: {
        fontSize: 13
      },
      [theme1.breakpoints.up("md")]: {
        fontSize: 16
      },
      [theme1.breakpoints.up("lg")]: {
        fontSize: 16
      }
    }
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
      userId: null,
      message: ""
    };
  }

  componentDidMount() {
    var localState = loadState();
    if (localState !== undefined) {
      this.setState({ isAuth: localState.isAuth, userId: localState.userId });
      if (
        this.props.location.pathname === "/" ||
        this.props.location.pathname === "/signup"
      ) {
        this.props.history.push("/courses");
      }
    } else {
      if (
        this.props.location.pathname === "/" ||
        this.props.location.pathname === "/signup"
      ) {

      } else {
        this.props.history.push("/");
      }
    }
  }

  setSnack = message => {
    this.setState({ message });
  };

  setAuth = (isAuth, userId) => {
    this.setState({ isAuth, userId });
  };

  render() {
    return (
      <React.Fragment>
        <ThemeProvider theme={theme1}>
          <Header
            isAuth={this.state.isAuth}
            userId={this.state.userId}
            setAuth={this.setAuth}
            setSnack={this.setSnack}
          />
          <Toolbar />
          <SnackBar
            message={this.state.message}
            closeSnackBar={() => this.setState({ message: "" })}
          />
          <Container>
            <Switch>
              <Route
                exact
                path="/"
                component={() => (
                  <Login setAuth={this.setAuth} />
                )}
              />
              <Route
                exact
                path="/signup"
                component={() => <SignUp />}
              />
              <Route
                exact
                path="/courses"
                component={() => <CourseList />}
              />
              <Route
                exact
                path="/course/:courseid"
                component={() => <Course />}
              />
              <Route
                exact
                path="/payment/:courseid"
                component={() => <Payment />}
              />
              <Route
                exact
                path="/error/unAuthorized"
                component={() => <UnAuthorized />}
              />

              <Route
                exact
                path="/error/loginRequired"
                component={() => <LoginRequired />}
              />
              <Route component={() => <PageNotFound />} />
            </Switch>
          </Container>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(App));
