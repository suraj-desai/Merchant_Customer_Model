import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";


class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
        name: "",
        email: "",
        password: "",
        city:"",
        amount:"",
        errors: {},  
    };
}
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
checkout=(e)=>{
  e.preventDefault();
    window.paysafe.checkout.setup("cHVibGljLTc3NTE6Qi1xYTItMC01ZjAzMWNiZS0wLTMwMmQwMjE1MDA4OTBlZjI2MjI5NjU2M2FjY2QxY2I0YWFiNzkwMzIzZDJmZDU3MGQzMDIxNDUxMGJjZGFjZGFhNGYwM2Y1OTQ3N2VlZjEzZjJhZjVhZDEzZTMwNDQ=", {
        "currency": "USD",
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
        "paymentMethodDetails": {
            "paysafecard": {
                "consumerId": "1232323"
            },
            "paysafecash": {
                "consumerId": "123456"
            },
            "sightline": {
                "consumerId": "123456"
            },
            "vippreferred":{
                "consumerId": "550726575"
            }
        },
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

  render() {
    const { user } = this.props.auth;
    const {errors} =this.state;
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                You are here to Pay safe{" "}
                <span style={{ fontFamily: "monospace" }}>With</span> PaySafe 👏
              </p>
            </h4>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Enter details to pay</b>
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
                  value={this.state.city}
                  error={errors.city}
                  id="city"
                  type="text"
                  className={classnames("", {
                    invalid: errors.city
                  })}
                />
                <label htmlFor="city">City</label>
                <span className="red-text">{errors.city}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.amount}
                  error={errors.amount}
                  id="amount"
                  type="Number"
                  className={classnames("", {
                    invalid: errors.amount
                  })}
                />
                <label htmlFor="amount">Amount</label>
                <span className="red-text">{errors.amount}</span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  onClick={this.checkout}
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
      
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);