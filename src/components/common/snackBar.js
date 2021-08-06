import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

function SnackBar(props) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      open={props.message.length > 0}
      autoHideDuration={2000}
      onClose={() => props.closeSnackBar()}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{props.message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => props.closeSnackBar()}
        >
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
}

export default SnackBar;
