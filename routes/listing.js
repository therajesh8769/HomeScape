const express=require("express");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");

const upload=multer({storage});
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware/middleware.js");
const {validateListing}=require("../middleware/middleware.js");
const {isOwner}=require("../middleware/middleware.js");



const ListingController=require("../controllers/listings.js");

router.route("/")
//index
.get( wrapAsync(ListingController.index)
   )
   //add new listing
  .post(isLoggedIn,
  
    upload.single('listing[image]'),
    wrapAsync(ListingController.createListing));

//new route
router.get("/new",isLoggedIn, ListingController.renderNewForm);
router.route("/:id")
//show in detail
.get(wrapAsync(ListingController.show))
//update
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.updateListing))
//delete
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing)
);
  
    //update
    router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm));
   
    
   
    module.exports=router;
