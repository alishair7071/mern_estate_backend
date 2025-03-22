const mongoose = require("mongoose");
const listingModel = require("../models/listing.model");
const errorHandler = require("../utills/error");

const createListing = async (req, res, next) => {
  console.log(req.body);
  try {
    console.log("enterd in try");
    const listing = await listingModel.create(req.body);
    res.status(201).json(listing);
  } catch (e) {
    next(e.message);
    console.log(e.message);
  }
};


const deleteListing = async (req, res, next) => {
  const listing = await listingModel.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can delete only your own listing"));
  }
  try {
    await listingModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "listing has been deleted",
    });
    console.log("Deleted");
  } catch (e) {
    next(e);
  }
};


const updateListing = async (req, res, next) => {
  const listing = await listingModel.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "liting not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listing"));
  }

  try {
    const updatedListing = await listingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (e) {
      next(e);
  }
};


const getListing= async (req, res, next)=>{
  try{
    const listing= await listingModel.findById(req.params.id);
    if(!listing){
      return next(errorHandler(404, 'listing is not found'));
    }
    res.status(200).json(listing);

  }catch(e){
    next(e);
  }      
}



const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer == undefined || offer == "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished == undefined || furnished == "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking == undefined || parking == "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type == undefined || type == "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await listingModel
      .find({
        name: { $regex: searchTerm, $options: "i" },
        offer: offer,
        parking: parking,
        furnished: furnished,
        type: type,
      })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);

      res.status(200).json(listings);
  } catch (e) {
    next(e);
  }
};


module.exports = { createListing, deleteListing, updateListing, getListing, getListings };
