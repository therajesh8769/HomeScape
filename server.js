const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");
const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');
const mongoose=require("mongoose");
const session=require("express-session");
 app.use(cookieParser());

const methodOverride=require('method-override');
const ejsMate=require("ejs-mate");
const joi=require("joi");
app.engine("ejs",ejsMate);


app.use(methodOverride("_method"));

const ExpressError=require("./utils/ExpressError.js");
const path=require("path");

app.set('views',path.join(__dirname,'views'));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(session({secret:"mysupersecretstring"}));




    app.get("/test",(req,res)=>{
        res.send("test successful");  
      });
app.listen(8080,()=>
{
    console.log("listening");
});



