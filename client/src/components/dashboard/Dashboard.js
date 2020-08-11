import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import classnames from "classnames";
import axios from "axios";
// import { payment } from "../../actions/authActions";


class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
        name: "",
        street:"",
        city:"",
        zip:"",
        amount:"",
        errors: {},
        singleUseCustomerToken:"",  
    };
}
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value});
  };
  payment =async userData=> {
    var check=0;
    await axios
      .post("/api/users/payment", userData)
      .then(res => {
          check=1;
      })
      .catch(()=>{
        check=0;
      })
      return check;
  };
  checkout=async (e)=> {
    e.preventDefault();
    if(this.state.amount===""||this.state.city===""||this.state.name===""||
    this.state.street===""||this.state.zip===""){
      alert("Please enter valid details")
    }
    else if(this.state.amount<=0){
      alert("Amount should be greater than 0");
    }
    else{
      const userData=this.props.auth.user;
      await axios
        .post("/api/users/token", userData)
        .then(res => {
            this.state.singleUseCustomerToken=res.data.singleUseCustomerToken;
        })
        .catch(()=>{
        })
        if(this.state.singleUseCustomerToken==null){
      
        this.checkoutWithoutToken();
        }
        else{
      
        this.checkoutWithToken();
        }
    }
};

checkoutWithToken=(e)=>{
  this.state.amount=parseInt(this.state.amount);
  console.log(typeof(this.state.amount));
    window.paysafe.checkout.setup("cHVibGljLTc3NTE6Qi1xYTItMC01ZjAzMWNiZS0wLTMwMmQwMjE1MDA4OTBlZjI2MjI5NjU2M2FjY2QxY2I0YWFiNzkwMzIzZDJmZDU3MGQzMDIxNDUxMGJjZGFjZGFhNGYwM2Y1OTQ3N2VlZjEzZjJhZjVhZDEzZTMwNDQ=", {
        "currency": "USD",
        "amount": this.state.amount*100,
        "singleUseCustomerToken": this.state.singleUseCustomerToken,
        "locale": "en_US",
        "customer": {
            "firstName":this.state.name,
            "lastName":"desai",
            "email": "johndee@paysafe.com",
            "dateOfBirth": {
                "day": 1,
                "month": 7,
                "year": 1990
            }
        },
        "billingAddress": {
            "street": this.state.street,
            "city": this.state.city,
            "zip": this.state.zip,
            "country": "IN"
        },
        "environment": "TEST",
        "merchantRefNum": Date.now()+"",
        "canEditAmount": true,
        "paymentMethodDetails": {
            "card": {
            },
          },
    }, (instance, error, result)=>{
        if (result && result.paymentHandleToken) {
          const data=this.props.auth.user;
          data.result=result;
          (async ()=>{
            const success= await this.payment(data);
            
            if(success){
              instance.showSuccessScreen();
            }
            else {
              instance.showFailureScreen();
            }
          })();
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
  };
  checkoutWithoutToken=(e)=>{
          this.state.amount=parseInt(this.state.amount);
          console.log(this.state.amount);
          console.log(typeof(this.state.amount));
            window.paysafe.checkout.setup("cHVibGljLTc3NTE6Qi1xYTItMC01ZjAzMWNiZS0wLTMwMmQwMjE1MDA4OTBlZjI2MjI5NjU2M2FjY2QxY2I0YWFiNzkwMzIzZDJmZDU3MGQzMDIxNDUxMGJjZGFjZGFhNGYwM2Y1OTQ3N2VlZjEzZjJhZjVhZDEzZTMwNDQ=",
             {
                "currency": "USD",
                "amount": this.state.amount*100,
                "locale": "en_US",
                "customer": {
                    "firstName": this.state.name,
                    "lastName":"desai",
                    "email": "john@paysafe.com",
                    "dateOfBirth": {
                        "day": 1,
                        "month": 7,
                        "year": 1990
                    }
                },
                "billingAddress": {
                  "street": this.state.street,
                  "city": this.state.city,
                  "zip": this.state.zip,
                  "country": "IN"
                },
                "environment": "TEST",
                "merchantRefNum": Date.now()+"",
                "canEditAmount": true,
                "merchantDescriptor": {   
                    "dynamicDescriptor": "XYZ",
                    "phone": "1234567890"
                    },
                "displayPaymentMethods":["card"],
                "paymentMethodDetails": {
                  "card": {
                  },
              }
            }, (instance, error, result)=>{
                if (result && result.paymentHandleToken) {
                    const data=this.props.auth.user;
                    data.result=result;
                    (async ()=>{
                      const success= await this.payment(data);
                      console.log("succes"+success);
                      if(success){
                        instance.showSuccessScreen();
                      }
                      else {
                        instance.showFailureScreen();
                      }
                    })();
                    
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
                  value={this.state.street}
                  error={errors.street}
                  id="street"
                  type="text"
                  className={classnames("", {
                    invalid: errors.street
                  })}
                />
                <label htmlFor="street">street</label>
                <span className="red-text">{errors.city}</span>
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
                <label htmlFor="street">City</label>
                <span className="red-text">{errors.city}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.zip}
                  error={errors.zip}
                  id="zip"
                  type="text"
                  className={classnames("", {
                    invalid: errors.zip
                  })}
                />
                <label htmlFor="zip">zip</label>
                <span className="red-text">{errors.zip}</span>
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
