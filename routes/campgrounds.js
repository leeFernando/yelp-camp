var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");


//Campground Index
router.get("/", function(req, res) {
    //get all campgrounds from DB
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, page: "campgrounds"});
        }
    });
});

//Campground New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//Campground Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newGround = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    };
    Campground.create(newGround, function(err, newlyAdded) {
        if(err) {
            console.log(err);
        } else {
            req.flash("success", "Campground successfully added!");
            res.redirect("/campground");
        }
    });
});

//Campground Show
router.get("/:id", function(req, res) {
    //find the campground with the provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found!");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
});

//Campground Edit
router.get("/:id/edit", middleware.checkPostOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            res.redirect("/campground");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//Campground Update
router.put("/:id", middleware.checkPostOwner, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
        if(err) {
            res.redirect("/campground");
        } else {
            req.flash("success", "Post updated!");
            res.redirect("/campground/" + req.params.id);
        }
    });
});

//Campground Destroy
router.delete("/:id", middleware.checkPostOwner, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err) {
        if(err) {
            res.redirect("/campground");
        } else {
            req.flash("error", "Post deleted!");
            res.redirect("/campground");
        }
    });
});

module.exports = router;