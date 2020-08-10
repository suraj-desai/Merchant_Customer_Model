const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const path=require('path');
const users = require("./routes/api/users");
const mongoose=require("mongoose");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
// require("./config/keys");
// Passport middleware
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;
if(process.env.NODE_ENV=='production'){
  app.use(express.static('client/build'));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  })
}

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
