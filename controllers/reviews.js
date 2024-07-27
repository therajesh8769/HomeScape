const Review=require("../models/review.js");

module.exports.createReview=async(req,res,next)=>
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
    
    };
    module.exports.destroyReview=async(req,res)=>
        {
            let {id,reviewId}=req.params;
            await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
           await Review.findByIdAndDelete(reviewId);
           req.flash("success","Review Deleted");
           res.redirect(`/listings/${id}`);
    
        };
