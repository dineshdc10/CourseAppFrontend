import React from "react";
import { CardContent, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { loadNotAccess, removeNotAccess } from "../../localStorage";

class UnAuthorized extends React.Component {
  constructor(props) {
    super(props);
    var Attempts = loadNotAccess();
    this.state = {
      attempt: Attempts.attempt
    };
  }
  componentDidMount() {
    if (this.state.attempt >= 4) {
      removeNotAccess();
    }
  }
  render() {
    return (
      <React.Fragment>
        <Card>
          <CardContent>
            <Typography align="center" color="error">
              <b>
                {" "}
                Error 403 : You are not authorized to View this page. Please
                stay in your assigned Grey area!!
              </b>
            </Typography>
          </CardContent>
        </Card>
      </React.Fragment>
    );
  }
}

export default UnAuthorized;
