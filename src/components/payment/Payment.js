import React from "react";
import TextField from '@material-ui/core/TextField';
import Cards from "react-credit-cards";
import Payment from "payment";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackBar from "../common/snackBar";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";
import Config from '../../config';
import { removeState } from "../../localStorage";

import "react-credit-cards/es/styles-compiled.css";

const styles = () => ({
    card: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    title: {
        display: 'flex', alignItems: 'center', justifyContent: 'left',
        backgroundColor: "#0b1e28", color: "white", marginBottom: 20
    }
});

class PaymentPage extends React.Component {
    constructor(props) {
        super(props);
        let courseid = "";
        if (props.match.params.courseid) {
            courseid = parseInt(props.match.params.courseid.toString());
        }
        if (!courseid) {
            props.history.push({
                pathname: "/courses"
            })
        }
        this.state = {
            number: "",
            name: "",
            expiry: "",
            cvc: "",
            issuer: "",
            focused: "",
            formData: null,
            openOTP: false,
            message: "",
            otptext: "",
            courseid: courseid
        };
    }


    handleCallback = ({ issuer }, isValid) => {
        if (isValid) {
            this.setState({ issuer });
        }
    };

    handleInputFocus = ({ target }) => {
        this.setState({
            focused: target.name
        });
    };

    handleInputChange = ({ target }) => {
        if (target.name === "number") {
            target.value = this.formatCreditCardNumber(target.value);
        } else if (target.name === "expiry") {
            target.value = this.formatExpirationDate(target.value);
        } else if (target.name === "cvc") {
            target.value = this.formatCVC(target.value);
        }

        this.setState({ [target.name]: target.value });
    };

    handleSubmit = e => {
        e.preventDefault();
        const formData = [...e.target.elements]
            .filter(d => d.name)
            .reduce((acc, d) => {
                acc[d.name] = d.value;
                return acc;
            }, {});

        this.setState({ formData });
        this.form.reset();
    };

    clearNumber = (value = "") => {
        return value.replace(/\D+/g, "");
    }

    formatCreditCardNumber = (value) => {
        if (!value) {
            return value;
        }

        const issuer = Payment.fns.cardType(value);
        const clearValue = this.clearNumber(value);
        let nextValue;

        switch (issuer) {
            case "amex":
                nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                    4,
                    10
                )} ${clearValue.slice(10, 15)}`;
                break;
            case "dinersclub":
                nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                    4,
                    10
                )} ${clearValue.slice(10, 14)}`;
                break;
            default:
                nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
                    4,
                    8
                )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
                break;
        }

        return nextValue.trim();
    }
    formatCVC = (value, prevValue, allValues = {}) => {
        const clearValue = this.clearNumber(value);
        let maxLength = 4;

        if (allValues.number) {
            const issuer = Payment.fns.cardType(allValues.number);
            maxLength = issuer === "amex" ? 4 : 3;
        }

        return clearValue.slice(0, maxLength);
    }

    formatExpirationDate = (value) => {
        const clearValue = this.clearNumber(value);

        if (clearValue.length >= 3) {
            return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
        }

        return clearValue;
    }

    openPopUpOTP = () => {
        this.setState({
            openOTP: true
        })
    }

    closePopUpOTP = () => {
        this.setState({
            openOTP: false
        })
    }

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

    submitOTP = () => {
        if (this.state.otptext.trim().length > 0) {
                var otpdata = { otp: this.state.otptext.trim(),courseid: this.state.courseid };
                fetch(Config.url + "/courses/addcourse", {
                    method: "POST",
                    body: JSON.stringify(otpdata),
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
                            if (data.success) {
                                this.props.history.push("/courses");
                            } else {
                                this.setSnack("Invalid OTP");
                            }
                        }
                    }).catch((err) => {
                        this.setSnack("Sorry,we are unable to serve you now!!")
                    });
        }
        else {
            this.setSnack("Invalid OTP!");
        }
    }

    setSnack = message => {
        this.setState({ message });
    };


    render() {
        const { name, number, expiry, cvc, focused, issuer } = this.state;
        const classes = this.props.classes;
        return (
            <div key="Payment">
                <SnackBar
                    message={this.state.message}
                    closeSnackBar={() => this.setState({ message: "" })}
                />
                <Dialog open={this.state.openOTP} onClose={this.closePopUpOTP} aria-labelledby="form-dialog-title">
                    <form onSubmit={this.submitOTP}>
                        <DialogTitle id="form-dialog-title">OTP</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="OTP"
                                name="otptext"
                                type="tel"
                                pattern="\d{6}"
                                required
                                fullWidth
                                onChange={this.handleInputChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closePopUpOTP} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.submitOTP} color="primary">
                                Submit
                                </Button>
                        </DialogActions>
                    </form>
                </Dialog>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                        <h4>Please enter your credit card details to proceed with payment for your course </h4>
                    </Grid>
                    <Grid item xs={12} sm={8} md={6} lg={6} className={classes.card}>
                        <Cards
                            number={number}
                            name={name}
                            expiry={expiry}
                            cvc={cvc}
                            focused={focused}
                            callback={this.handleCallback}
                            />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={6} className={classes.card}>
                        <form ref={c => (this.form = c)} onSubmit={this.handleSubmit}>
                            <Grid container spacing={1} style={{ marginTop: 20 }} className={classes.card}>
                                <Grid item xs={12} sm={12} md={12} className={classes.card}>
                                    <TextField
                                        type="tel"
                                        name="number"
                                        className="form-control"
                                        placeholder="Card Number"
                                        pattern="[\d| ]{16,22}"
                                        required
                                        onChange={this.handleInputChange}
                                        onFocus={this.handleInputFocus}
                                    />

                                </Grid>
                                <Grid item xs={12} sm={12} md={12} className={classes.card}>
                                    <TextField
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Name"
                                        required
                                        onChange={this.handleInputChange}
                                        onFocus={this.handleInputFocus}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} className={classes.card}>
                                    <TextField
                                        type="tel"
                                        name="expiry"
                                        className="form-control"
                                        placeholder="Valid Thru"
                                        pattern="\d\d/\d\d"
                                        required
                                        onChange={this.handleInputChange}
                                        onFocus={this.handleInputFocus}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} className={classes.card}>
                                    <TextField
                                        type="tel"
                                        name="cvc"
                                        className="form-control"
                                        placeholder="CVC"
                                        pattern="\d{3,4}"
                                        required
                                        onChange={this.handleInputChange}
                                        onFocus={this.handleInputFocus}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} className={classes.card}>
                                    <input type="hidden" name="issuer" value={issuer} />
                                    <Button variant={'outlined'} onClick={this.openPopUpOTP} color="primary">
                                        PAY
                                    </Button>
                                </Grid>
                            </Grid>
                    </form>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(PaymentPage));
