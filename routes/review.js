const express=require("express");

const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const {isLoggedIn}=require("../middleware/middleware.js");
const Listing=require("../models/listing.js");
const {validateReview}=require("../middleware/middleware.js")
 const {isReviewAuthor}=require("../middleware/middleware.js")
const cookieParser=require("cookie-parser");
const session=require("express-session");
router.use(session({secret:"mysupersecretstring",resave:false,saveUninitialized:true}));
const flash=require("connect-flash");
router.use(flash());
 router.use(cookieParser("rajesh"));



//reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res,next)=>
    {   
        let {id}=req.params;
       const listing= await Listing.findById(id);
       if (!listing) {
        throw new ExpressError(404, 'Listing not found');
      }
       let newReview=new Review(req.body.review);
       newReview.author=req.user._id;
       console.log(newReview);
       listing.reviews.push(newReview);
      await newReview.save();
      await  listing.save();
      
      
      req.flash("success","review added");
      
      
      res.redirect(`/listings/${id}`);
    
    }));
    //delete reviews
    router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>
    {
        let {id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
       await Review.findByIdAndDelete(reviewId);
       req.flash("success","Review Deleted");
       res.redirect(`/listings/${id}`);

    }));
    module.exports=router;