import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
class Checkout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {},
        };
    }
    componentDidMount () {
        const script = document.createElement("script");
        script.src = "https://hosted.test.paysafe.com/checkout/v2/paysafe.checkout.min.js";
        script.async = true;
        window.body.appendChild(script);
    const checkout=()=>{
        this.paysafe.checkout.setup("cHVibGljLTc3NTE6Qi1xYTItMC01ZjAzMWNiZS0wLTMwMmQwMjE1MDA4OTBlZjI2MjI5NjU2M2FjY2QxY2I0YWFiNzkwMzIzZDJmZDU3MGQzMDIxNDUxMGJjZGFjZGFhNGYwM2Y1OTQ3N2VlZjEzZjJhZjVhZDEzZTMwNDQ=",
         {
            "currency": "INR",
            "amount": 10000,
            "singleUseCustomerToken": "SPFAB1cA5iwdu48H",
            "locale": "en_US",
            "customer": {
                "firstName": "John",
                "lastName": "Dee",
                "email": "johndee@paysafe.com",
                "phone": "1234567890",
                "dateOfBirth": {
                    "day": 1,
                    "month": 7,
                    "year": 1990
                }
            },
            "billingAddress": {
                "nickName": "John Dee",
                "street": "20735 Stevens Creek Blvd",
                "street2": "Montessori",
                "city": "Cupertino",
                "zip": "95014",
                "country": "US",
                "state": "CA"
            },
            "environment": "TEST",
            "merchantRefNum": "1559900597607",
            "canEditAmount": true,
            "payout": true,
            "payoutConfig": {
                "maximumAmount": 100000
            }
        }, function(instance, error, result) {
            if (result && result.paymentHandleToken) {
                console.log(result.paymentHandleToken);
                // make AJAX call to Payments API
            } else {
                console.error(error);
                // Handle the error
            }
        }, function(stage, expired) {
            switch(stage) {
                case "PAYMENT_HANDLE_NOT_CREATED": // Handle the scenario
                case "PAYMENT_HANDLE_CREATED": // Handle the scenario
                case "PAYMENT_HANDLE_REDIRECT": // Handle the scenario
                case "PAYMENT_HANDLE_PAYABLE": // Handle the scenario
                default: // Handle the scenario
            }
        });
    }
}
    render(){
        const {errors} =this.state;
        return (
            <div>
                <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Enter Details</b>
              </h4>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <label htmlFor="name">Name</label>
                <span className="red-text">{errors.name}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="City"
                  type="string"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label htmlFor="email">City</label>
                <span className="red-text">{errors.email}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="pinCode"
                  type="Number"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
                <label htmlFor="password">pinCode</label>
                <span className="red-text">{errors.password}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="amount"
                  type="Number"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <label htmlFor="password2">Confirm Password</label>
                <span className="red-text">{errors.password2}</span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  onSubmit={this.checkout}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
            </div>
        )
    }
}

export default Checkout;