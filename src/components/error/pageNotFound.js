import React from "react";
import { CardContent, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";

class LoginRequired extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Card>
          <CardContent>
            <Typography align="center" color="error">
              <b>Error 404 : Page not Found!!</b>
            </Typography>
          </CardContent>
        </Card>
      </React.Fragment>
    );
  }
}

export default LoginRequired;
