const Listing=require("../models/listing.js");
const {listingSchema}=require("../utils/schema.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../utils/schema.js");
const Review=require("../models/review.js");




module.exports.isLoggedIn=(req,res,next)=>
    {
        if(!req.isAuthenticated())
            {   req.session.redirectUrl=req.originalUrl;
                req.flash("error","login to access")
               return res.redirect("/login");
            }
            next();
    }
    module.exports.saveRedirectUrl=(req,res,next)=>
        {
            if(req.session.redirectUrl)
                {
                   res.locals.redirectUrl=req.session.redirectUrl; 
                }
                next();
        };
        module.exports.isOwner=async(req,res,next)=>
            { let {id}=req.params;
               let listing=await Listing.findById(id);
                if(res.locals.currUser && ! listing.owner._id.equals(res.locals.currUser._id))
                    {
                        req.flash("error","Access Denied")
                        return res.redirect(`/listings/${id}`);
                    }
                    next();
            };
            module.exports.validateListing=(req,res,next)=>{
                console.log(req.body);
                const {error}= listingSchema.validate(req.body);
                   if(error)
                    { const errMsg=error.details.map((el)=>el.message).join(",");
                        throw new ExpressError(400,errMsg);
                    }
                    else{
                        next();
                    }
            };
            module.exports.validateReview=(req,res,next)=>{
    
                const Listing=require("../models/listing.js"); 
                let {error}= reviewSchema.validate(req.body);
                   if(error)
                    { let errMsg=error.details.map((el)=>el.message).join(",");
                        throw new ExpressError(400,error);
                    }
                    else{
                        next();
                    }
            };
            module.exports.isReviewAuthor = async (req, res, next) => {
                const { id, reviewId } = req.params;
                const review = await Review.findById(reviewId);
            
                if (!review) {
                    req.flash("error", "Review not found");
                    return res.redirect(`/listings/${id}`);
                }
            
                if (!review.author.equals(res.locals.currUser._id)) {
                    req.flash("error", "Access Denied");
                    return res.redirect(`/listings/${id}`);
                }
            
                next();
            };