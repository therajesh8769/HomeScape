const axios = require('axios');
const Listing = require("../models/listing.js");

// Function to fetch coordinates using OpenCage Geocoding API
async function getCoordinates(address) {
    try {
        const apiKey =process.env.GEO_API; 
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                q: address,
                key: apiKey,
                limit: 1
            }
        });

       
        if (response.data.results.length > 0) {
            const { lat, lng: lon } = response.data.results[0].geometry;
            return { lat, lon };
        } else {
            console.log('Address not found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
}

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        let listingData = req.body.listing;
        let location = listingData.location;

        const coordinates = await getCoordinates(location);

        if (!coordinates || !coordinates.lat || !coordinates.lon) {
            req.flash("error", "Unable to get coordinates for the given location.");
            return res.redirect("/listings/new");
        }

        const { lat, lon } = coordinates;

        if (!req.body.listing) {
            throw new ExpressError(400, "Error! Send valid data");
        }

        listingData.owner = req.user._id;
        listingData.image = { url, filename };
        listingData.coordinates = { lat, lng: lon };

        const newListing = new Listing(listingData);

        await newListing.save();
        req.flash("success", "New Listing added");
        res.redirect("/listings");
    } catch (error) {
        console.error('Error creating listing:', error);
        req.flash("error", "An error occurred while creating the listing.");
        res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace(/\/upload\/(.*)/, '/upload/w_300,h_250/$1');
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    const updatedData = { ...req.body.listing };
    if (req.file) {
        updatedData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
};
