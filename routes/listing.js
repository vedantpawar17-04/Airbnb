const express=require('express');
const router=express.Router();
const wrapAsync=require("../Utils/wrapAsync.js");
const { isLoggedIn,isOwner} = require('../middleware.js');

const listingController=require('../controllers/listings.js');

//Returns a Multer instance that provides several methods for generating middleware that process files uploaded in multipart/form-data format.
const multer=require('multer');
const {storage}=require("../cloudConfig.js")
const upload=multer({storage});

//Index Route And Create Route
router.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));

//New Route
router.get('/new',isLoggedIn,listingController.renderNewForm);

//Show ,Update And Delete Route
router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//Edit Route
router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports=router;