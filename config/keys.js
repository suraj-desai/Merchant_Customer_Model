mongoose=require('mongoose');
mongoose.connect('mongodb+srv://suraj-desai:Olkha@123@cluster0-pvx4h.mongodb.net/myDB?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true});

mongoose.connection.on('connected',()=>{
    console.log("DB is connected");
});

mongoose.connection.on('error',(error)=>{
    console.log("There is error in DB connection");
})
secretOrKey: "secret"

module.exports={
  mongoose:mongoose,
  secretOrKey: "secret",
}