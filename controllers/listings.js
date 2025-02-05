const Listing = require('../models/listing.js');
const {listingSchema}=require('../schema.js');
module.exports.index=async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
};
module.exports.renderNewForm=(req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing=(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!listing) {
        req.flash('error', 'Listing You Requested For Does Not Exist!');
        res.redirect('/listings');
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
})

module.exports.createListing=(async(req, res,next) => {
    // Validation
    let result=listingSchema.validate(req.body);
    console.log(result);
    console.log(req.body); // Debugging
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..","filename"); // Debugging

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash('success', 'New Listing Created!');
    res.redirect('/listings');
})

module.exports.renderEditForm=(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing) {
        req.flash('error', 'Listing You Requested For Does Not Exist!');
        res.redirect('/listings');
    }
    res.render('listings/edit.ejs',{listing});
})

module.exports.updateListing=(async(req,res)=>{
    let {id}=req.params;
    let updatedList = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log('Updated Successfully',updatedList);

    if(typeof req.file!=='undefined')
    {
        let url=req.file.path;
        let filename=req.file.filename;
        updatedList.image={url,filename};
        await updatedList.save();
    }

    req.flash('success','Listing Is Updated Successfully!');
    res.redirect(`/listings/${id}`);
})

module.exports.destroyListing=(async(req,res)=>{
    let {id}=req.params;
    let DeletedList=await Listing.findByIdAndDelete(id);
    console.log('Deleted Successfully',DeletedList);
    req.flash('success','Listing Is Deleted Successfully!');
    res.redirect('/listings');
})