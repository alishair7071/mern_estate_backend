const express = require('express');
const { createListing, deleteListing, updateListing, 
    getListing, getListings } = require('../controllers/listing.controllers');
const verifyToken = require('../utills/verifyUser');
const router= express.Router();


router.post('/create-list',verifyToken, createListing);
router.delete('/delete/:id',verifyToken, deleteListing);
router.post('/updateListing/:id',verifyToken, updateListing);
router.get('/getListing/:id', getListing);
router.get('/get', getListings);





module.exports= router;
