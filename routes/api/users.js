const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const axios=require("axios");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        customerId:null,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          customerId:user.customerId,
          email:user.email,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.post('/token',(req,res)=>{
  (async ()=>{
    const data=req.body;
    const email=data.email;
    let customerId=null;
    await User.findOne({ email }).then(user => {
      // console.log(user);
      // console.log("inside");
      customerId=user.customerId;
      // console.log("customerId"+ customerId);
    });
    // customerId='6143ee5d-57de-46de-9de7-3e5c80121313';
    // console.log("customerId"+ customerId);
    if(customerId==null){
      const data={};
      data.singleUseCustomerToken=null;
      res.json(data);
    }
    else{
      let data={
        "merchantRefNum":Date.now()+"",
        "paymentTypes": [
          "CARD"
        ]
      }
      // console.log(data);
      let url=`https://api.test.paysafe.com/paymenthub/v1/customers/${customerId}/singleusecustomertokens`;
      // console.log(url);
      const headers={
        'Content-Type':'application/json',
        'Authorization':'Basic cHJpdmF0ZS03NzUxOkItcWEyLTAtNWYwMzFjZGQtMC0zMDJkMDIxNDQ5NmJlODQ3MzJhMDFmNjkwMjY4ZDNiOGViNzJlNWI4Y2NmOTRlMjIwMjE1MDA4NTkxMzExN2YyZTFhODUzMTUwNWVlOGNjZmM4ZTk4ZGYzY2YxNzQ4',
        'Simulator':'EXTERNAL',
      };
      axios.post(url, data,{
        headers:headers,
      })
      .then((resp)=>{
          console.log("token data");
          // console.log(resp.data);
          res.json(resp.data);
      })
      .catch( (error)=>{
        console.log(error);
           throw new Error("error hai");
      }
  
    )
  }
  })();

})

router.post('/payment',(req,res)=>{
  (async ()=>{
    const result=req.body.result;
    let customerId;
    let id;
    const email=req.body.email;
    await User.findOne({ email }).then(user => {
      customerId=user.customerId;
      id=user.id;
    });
    const data={
        "merchantRefNum": Date.now()+ "",
        "amount": result.amount,
        "currencyCode": "USD",
        "dupCheck": true,
        "settleWithAuth": false,
        "paymentHandleToken": result.paymentHandleToken,
        "customerIp": "10.10.12.64",
        "description": "Magazine subscription"
    }
    
      const headers={
          'Content-Type':'application/json',
          'Authorization':'Basic cHJpdmF0ZS03NzUxOkItcWEyLTAtNWYwMzFjZGQtMC0zMDJkMDIxNDQ5NmJlODQ3MzJhMDFmNjkwMjY4ZDNiOGViNzJlNWI4Y2NmOTRlMjIwMjE1MDA4NTkxMzExN2YyZTFhODUzMTUwNWVlOGNjZmM4ZTk4ZGYzY2YxNzQ4',
          'Simulator':'EXTERNAL',
      };
    const url='https://api.test.paysafe.com/paymenthub/v1/payments';
    if(result.customerOperation=="ADD"){
      console.log("payment with add");
      if(customerId==null){
        console.log("at 1");
        data.merchantCustomerId=id;
        console.log(typeof(data.merchantCustomerId));
        console.log(typeof(id));
      }
      else{
        console.log("at 2");
        data.customerId=customerId;
      }
      axios.post(url, data,{
        headers:headers,
      })
      .then((resp)=>{
          console.log(resp.data);
          var query = {'email': email};
          User.updateOne(query,{$set: { 'customerId': resp.data.customerId}}, {upsert: true}, function(err, doc) {
                  if (err) console.log(err);
                  else console.log('Successfully saved.');
                  
          });
          res.json(resp.data);
      })
      .catch( (error)=>{
        console.log(error);
            // throw new Error("error hai");
        }
  
      )
    }
    else{
      console.log("payment without add");
        axios.post(url, data, {
          headers:headers,
        })
        .then((resp)=>{
          console.log("without add");
          console.log(resp);
        }
  
        )
        res.json();
    }


  })()
}

)

module.exports = router;
